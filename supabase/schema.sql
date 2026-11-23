-- ============================================================================
--  ALTRA COMMAND — operational schema (Supabase / PostgreSQL 15+)
--  Alt ra Build Company Limited · Engineering tomorrow's horizons.
--
--  Apply with:  supabase db reset   (local)
--               supabase db push    (linked project)
--
--  Conventions
--    · snake_case columns, uuid primary keys, timestamptz audit stamps.
--    · Every table is protected by RLS; helpers live in `public` and are
--      marked SECURITY DEFINER so policies can read membership safely.
--    · Four roles: executive, pm, engineer, client.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ----------------------------------------------------------------------------
-- 1. Enums
-- ----------------------------------------------------------------------------
create type public.user_role          as enum ('executive', 'pm', 'engineer', 'client');
create type public.project_status     as enum ('pre-con', 'active', 'on-hold', 'handover');
create type public.phase_name         as enum ('Foundation', 'Superstructure', 'MEP', 'Envelope', 'Fit-out');
create type public.phase_status       as enum ('not-started', 'in-progress', 'complete', 'blocked');
create type public.task_status        as enum ('backlog', 'in-progress', 'review', 'done');
create type public.task_priority      as enum ('low', 'medium', 'high', 'critical');
create type public.incident_type      as enum ('near-miss', 'minor', 'severe', 'routine-check');
create type public.incident_severity  as enum ('low', 'medium', 'high', 'critical');
create type public.incident_status    as enum ('open', 'under-review', 'resolved');
create type public.requisition_status as enum ('pending', 'approved', 'rejected', 'delivered');
create type public.material_category  as enum ('structural', 'electrical', 'plumbing', 'finishing');
create type public.rfi_status         as enum ('open', 'answered', 'pending-approval', 'closed');
create type public.invoice_status     as enum ('draft', 'submitted', 'due', 'paid', 'overdue');
create type public.weather_condition  as enum ('clear', 'cloudy', 'light-rain', 'heavy-rain', 'windy', 'extreme-heat');
create type public.alert_severity     as enum ('info', 'warning', 'critical');
create type public.alert_kind         as enum ('safety', 'procurement', 'schedule', 'sos');
create type public.document_category  as enum ('drawing', 'specification', 'certificate', 'report', 'contract');
create type public.document_status    as enum ('current', 'superseded', 'for-review');
create type public.compliance_status  as enum ('compliant', 'action-required', 'overdue');
create type public.safety_standard    as enum ('ISO 45001', 'OSHA', 'Company');

-- ----------------------------------------------------------------------------
-- 2. Identity
-- ----------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null,
  email       citext not null unique,
  role        public.user_role not null default 'client',
  phone       text,
  avatar_url  text,
  title       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'One row per Supabase auth user; role drives every RLS policy.';

-- ----------------------------------------------------------------------------
-- 3. Projects & programme
-- ----------------------------------------------------------------------------
create table public.projects (
  id                     uuid primary key default gen_random_uuid(),
  project_code           text not null unique,
  name                   text not null,
  client_name            text not null,
  client_id              uuid references public.profiles (id) on delete set null,
  division               text not null,
  status                 public.project_status not null default 'pre-con',
  budget_total           numeric(16, 2) not null check (budget_total >= 0),
  budget_spent           numeric(16, 2) not null default 0 check (budget_spent >= 0),
  start_date             date not null,
  target_date            date not null,
  pm_id                  uuid references public.profiles (id) on delete set null,
  lat                    double precision not null,
  lng                    double precision not null,
  weather_location       text,
  address                text,
  workforce              integer not null default 0,
  safe_man_hours         numeric(14, 2) not null default 0,
  schedule_variance_days integer not null default 0,
  cover_path             text,
  summary                text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint projects_dates check (target_date >= start_date)
);

create table public.project_members (
  project_id uuid not null references public.projects (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, profile_id)
);

create table public.phases (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  name        public.phase_name not null,
  start_date  date not null,
  end_date    date not null,
  progress    integer not null default 0 check (progress between 0 and 100),
  status      public.phase_status not null default 'not-started',
  weight      numeric(4, 3) not null default 0.2,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (project_id, name)
);

create table public.tasks (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id) on delete cascade,
  phase         public.phase_name not null,
  title         text not null,
  trade         text,
  status        public.task_status not null default 'backlog',
  priority      public.task_priority not null default 'medium',
  assignee_id   uuid references public.profiles (id) on delete set null,
  due_date      date,
  blocked_reason text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. Field operations
-- ----------------------------------------------------------------------------
create table public.daily_site_logs (
  id                 uuid primary key default gen_random_uuid(),
  project_id         uuid not null references public.projects (id) on delete cascade,
  created_by         uuid not null references public.profiles (id) on delete restrict,
  log_date           date not null default current_date,
  weather            public.weather_condition not null,
  temperature_c      integer not null check (temperature_c between -10 and 60),
  manpower           jsonb not null default '[]'::jsonb,
  manpower_total     integer not null default 0,
  work_completed     text not null,
  delays             text,
  photos             jsonb not null default '[]'::jsonb,
  synced_from_field  boolean not null default true,
  client_uuid        uuid,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  -- the field PWA may replay an offline record; this makes sync idempotent
  unique (project_id, log_date, client_uuid)
);

comment on column public.daily_site_logs.photos is
  'Array of {id, dataUrl, capturedAt, lat, lng, watermark}; images live in storage.';
comment on column public.daily_site_logs.client_uuid is
  'Idempotency key generated by the field PWA before it goes offline.';

create table public.safety_incidents_inspections (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references public.projects (id) on delete cascade,
  inspector_id      uuid not null references public.profiles (id) on delete restrict,
  type              public.incident_type not null,
  severity          public.incident_severity not null,
  title             text not null,
  description       text not null,
  corrective_action text,
  status            public.incident_status not null default 'open',
  occurred_at       timestamptz not null,
  signed_off_at     timestamptz,
  signed_off_by     uuid references public.profiles (id),
  photos            jsonb not null default '[]'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint signoff_consistency check (
    (status = 'resolved' and signed_off_at is not null and signed_off_by is not null)
    or status <> 'resolved'
  )
);

create table public.safety_checklist_items (
  id            uuid primary key default gen_random_uuid(),
  clause        text not null,
  requirement   text not null,
  standard      public.safety_standard not null,
  status        public.compliance_status not null default 'action-required',
  owner_id      uuid references public.profiles (id),
  last_audited  date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.site_alerts (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  raised_by    uuid references public.profiles (id) on delete set null,
  severity     public.alert_severity not null,
  kind         public.alert_kind not null,
  title        text not null,
  detail       text,
  latitude     double precision,
  longitude    double precision,
  acknowledged boolean not null default false,
  acknowledged_by uuid references public.profiles (id),
  acknowledged_at timestamptz,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 5. Commercial
-- ----------------------------------------------------------------------------
create table public.material_inventory (
  id             uuid primary key default gen_random_uuid(),
  sku            text not null unique,
  item_name      text not null,
  category       public.material_category not null,
  unit           text not null,
  stock_level    numeric(14, 2) not null default 0,
  reorder_point  numeric(14, 2) not null default 0,
  unit_cost      numeric(14, 2) not null default 0,
  warehouse      text not null,
  last_counted_at date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.material_inventory_requisitions (
  id                     uuid primary key default gen_random_uuid(),
  project_id             uuid not null references public.projects (id) on delete cascade,
  requested_by           uuid not null references public.profiles (id) on delete restrict,
  inventory_id           uuid references public.material_inventory (id) on delete set null,
  item_name              text not null,
  category               public.material_category not null,
  quantity_requested     numeric(14, 2) not null check (quantity_requested > 0),
  unit                   text not null,
  estimated_cost         numeric(16, 2) not null default 0,
  approval_status        public.requisition_status not null default 'pending',
  approved_by            uuid references public.profiles (id),
  approved_at            timestamptz,
  delivery_tracking_code text,
  required_by            date,
  supplier               text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table public.rfis_and_change_orders (
  id                   uuid primary key default gen_random_uuid(),
  project_id           uuid not null references public.projects (id) on delete cascade,
  rfi_number           text not null,
  title                text not null,
  description          text not null,
  raised_by            uuid not null references public.profiles (id) on delete restrict,
  is_change_order      boolean not null default false,
  cost_impact          numeric(16, 2) not null default 0,
  schedule_impact_days integer not null default 0,
  architect_response   text,
  status               public.rfi_status not null default 'open',
  approved_by          uuid references public.profiles (id),
  approved_at          timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (project_id, rfi_number)
);

create table public.invoices (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.projects (id) on delete cascade,
  invoice_number text not null unique,
  milestone      text not null,
  amount         numeric(16, 2) not null check (amount >= 0),
  issued_at      date not null,
  due_at         date not null,
  status         public.invoice_status not null default 'draft',
  paid_at        date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.monthly_financials (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  month      date not null,
  outflow    numeric(16, 2) not null default 0,
  billing    numeric(16, 2) not null default 0,
  forecast   numeric(16, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.documents (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  name         text not null,
  category     public.document_category not null,
  revision     text,
  storage_path text,
  file_size    text,
  uploaded_by  uuid references public.profiles (id) on delete set null,
  status       public.document_status not null default 'current',
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. Audit trail
-- ----------------------------------------------------------------------------
create table public.audit_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid references public.profiles (id) on delete set null,
  action      text not null,
  entity      text not null,
  entity_id   text,
  detail      text,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. Indexes
-- ----------------------------------------------------------------------------
create index projects_status_idx          on public.projects (status);
create index project_members_profile_idx  on public.project_members (profile_id);
create index phases_project_idx           on public.phases (project_id);
create index tasks_project_status_idx     on public.tasks (project_id, status);
create index daily_logs_project_date_idx  on public.daily_site_logs (project_id, log_date desc);
create index incidents_project_status_idx on public.safety_incidents_inspections (project_id, status);
create index requisitions_status_idx      on public.material_inventory_requisitions (project_id, approval_status);
create index rfis_status_idx              on public.rfis_and_change_orders (project_id, status);
create index invoices_project_status_idx  on public.invoices (project_id, status);
create index alerts_project_idx           on public.site_alerts (project_id, created_at desc);
create index audit_created_idx            on public.audit_log (created_at desc);

-- ----------------------------------------------------------------------------
-- 8. Triggers
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'projects', 'phases', 'tasks', 'daily_site_logs',
    'safety_incidents_inspections', 'safety_checklist_items',
    'material_inventory', 'material_inventory_requisitions',
    'rfis_and_change_orders', 'invoices'
  ]
  loop
    execute format(
      'create trigger %I_touch before update on public.%I
         for each row execute function public.touch_updated_at()',
      t, t
    );
  end loop;
end;
$$;

-- Derive manpower_total from the JSON array so the field app only sends trades.
create or replace function public.derive_manpower_total()
returns trigger
language plpgsql
as $$
begin
  select coalesce(sum((entry ->> 'count')::int), 0)
    into new.manpower_total
    from jsonb_array_elements(coalesce(new.manpower, '[]'::jsonb)) as entry;
  return new;
end;
$$;

create trigger daily_logs_manpower
  before insert or update of manpower on public.daily_site_logs
  for each row execute function public.derive_manpower_total();

-- Roll safe man-hours (8h shift) onto the project, ignoring replayed records.
create or replace function public.rollup_safe_man_hours()
returns trigger
language plpgsql
as $$
begin
  update public.projects
     set safe_man_hours = safe_man_hours + (new.manpower_total * 8)
   where id = new.project_id;
  return new;
end;
$$;

create trigger daily_logs_rollup
  after insert on public.daily_site_logs
  for each row execute function public.rollup_safe_man_hours();

-- Resolve project-phase status automatically as progress moves.
create or replace function public.sync_phase_status()
returns trigger
language plpgsql
as $$
begin
  if new.progress >= 100 then
    new.status := 'complete';
  elsif new.progress > 0 and new.status = 'not-started' then
    new.status := 'in-progress';
  end if;
  return new;
end;
$$;

create trigger phases_status
  before insert or update of progress on public.phases
  for each row execute function public.sync_phase_status();

-- Audit writes are centralised so every mutation leaves a trace.
create or replace function public.write_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  payload jsonb;
begin
  payload := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;

  insert into public.audit_log (actor_id, action, entity, entity_id, detail)
  values (
    actor,
    tg_op || ' ' || tg_table_name,
    tg_table_name,
    payload ->> 'id',
    left(payload::text, 480)
  );
  return null;
end;
$$;

create trigger audit_daily_logs
  after insert or update on public.daily_site_logs
  for each row execute function public.write_audit();

create trigger audit_rfis
  after insert or update on public.rfis_and_change_orders
  for each row execute function public.write_audit();

create trigger audit_requisitions
  after insert or update on public.material_inventory_requisitions
  for each row execute function public.write_audit();

-- ----------------------------------------------------------------------------
-- 9. Access helpers
-- ----------------------------------------------------------------------------
create or replace function public.app_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_executive()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.app_role() = 'executive', false);
$$;

create or replace function public.is_project_member(pid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.project_members
     where project_id = pid and profile_id = auth.uid()
  );
$$;

create or replace function public.can_see_project(pid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_executive() or public.is_project_member(pid);
$$;

-- ----------------------------------------------------------------------------
-- 10. Row level security
-- ----------------------------------------------------------------------------
alter table public.profiles                         enable row level security;
alter table public.projects                         enable row level security;
alter table public.project_members                  enable row level security;
alter table public.phases                           enable row level security;
alter table public.tasks                            enable row level security;
alter table public.daily_site_logs                  enable row level security;
alter table public.safety_incidents_inspections     enable row level security;
alter table public.safety_checklist_items           enable row level security;
alter table public.site_alerts                      enable row level security;
alter table public.material_inventory               enable row level security;
alter table public.material_inventory_requisitions  enable row level security;
alter table public.rfis_and_change_orders           enable row level security;
alter table public.invoices                         enable row level security;
alter table public.monthly_financials               enable row level security;
alter table public.documents                        enable row level security;
alter table public.audit_log                        enable row level security;

-- Profiles: self always, executives everything, colleagues on shared projects.
create policy profiles_select on public.profiles
  for select using (
    id = auth.uid()
    or public.is_executive()
    or exists (
      select 1
        from public.project_members me
        join public.project_members them on them.project_id = me.project_id
       where me.profile_id = auth.uid() and them.profile_id = profiles.id
    )
  );

create policy profiles_update_self on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Projects
create policy projects_select on public.projects
  for select using (public.can_see_project(id));

create policy projects_write on public.projects
  for all using (public.is_executive()) with check (public.is_executive());

-- Membership
create policy project_members_select on public.project_members
  for select using (public.can_see_project(project_id));

create policy project_members_write on public.project_members
  for all using (public.is_executive()) with check (public.is_executive());

-- Programme
create policy phases_select on public.phases
  for select using (public.can_see_project(project_id));

create policy phases_write on public.phases
  for all using (
    public.app_role() in ('executive', 'pm')
    and public.can_see_project(project_id)
  ) with check (
    public.app_role() in ('executive', 'pm')
    and public.can_see_project(project_id)
  );

create policy tasks_select on public.tasks
  for select using (public.can_see_project(project_id));

create policy tasks_insert on public.tasks
  for insert with check (
    public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  );

create policy tasks_update on public.tasks
  for update using (
    public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  ) with check (
    public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  );

-- Field logs: engineers own what they submit, PM/exec read the project.
create policy logs_select on public.daily_site_logs
  for select using (public.can_see_project(project_id));

create policy logs_insert on public.daily_site_logs
  for insert with check (
    created_by = auth.uid()
    and public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  );

create policy logs_update on public.daily_site_logs
  for update using (
    public.can_see_project(project_id)
    and (created_by = auth.uid() or public.app_role() in ('executive', 'pm'))
  ) with check (public.can_see_project(project_id));

-- Safety
create policy incidents_select on public.safety_incidents_inspections
  for select using (public.can_see_project(project_id));

create policy incidents_insert on public.safety_incidents_inspections
  for insert with check (
    inspector_id = auth.uid()
    and public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  );

create policy incidents_update on public.safety_incidents_inspections
  for update using (
    public.can_see_project(project_id)
    and (
      public.app_role() in ('executive', 'pm')
      or (public.app_role() = 'engineer' and inspector_id = auth.uid())
    )
  ) with check (
    -- only PM and executive may sign an incident off
    status <> 'resolved'
    or public.app_role() in ('executive', 'pm')
  );

create policy checklist_select on public.safety_checklist_items
  for select using (public.app_role() in ('executive', 'pm', 'engineer'));

create policy checklist_write on public.safety_checklist_items
  for all using (public.app_role() in ('executive', 'pm'))
  with check (public.app_role() in ('executive', 'pm'));

create policy alerts_select on public.site_alerts
  for select using (public.can_see_project(project_id));

create policy alerts_insert on public.site_alerts
  for insert with check (
    public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  );

create policy alerts_update on public.site_alerts
  for update using (public.can_see_project(project_id))
  with check (public.can_see_project(project_id));

-- Procurement: clients never see stock, requisitions or supplier pricing.
create policy inventory_select on public.material_inventory
  for select using (public.app_role() in ('executive', 'pm', 'engineer'));

create policy inventory_write on public.material_inventory
  for all using (public.app_role() in ('executive', 'pm'))
  with check (public.app_role() in ('executive', 'pm'));

create policy requisitions_select on public.material_inventory_requisitions
  for select using (
    public.can_see_project(project_id)
    and public.app_role() in ('executive', 'pm', 'engineer')
  );

create policy requisitions_insert on public.material_inventory_requisitions
  for insert with check (
    requested_by = auth.uid()
    and public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  );

create policy requisitions_update on public.material_inventory_requisitions
  for update using (
    public.can_see_project(project_id)
    and public.app_role() in ('executive', 'pm')
  ) with check (public.can_see_project(project_id));

-- Commercial
create policy rfis_select on public.rfis_and_change_orders
  for select using (public.can_see_project(project_id));

create policy rfis_insert on public.rfis_and_change_orders
  for insert with check (
    raised_by = auth.uid()
    and public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  );

create policy rfis_update on public.rfis_and_change_orders
  for update using (
    public.can_see_project(project_id)
    and public.app_role() in ('executive', 'pm')
  ) with check (
    -- approving a change order is a PM/executive action only
    (status <> 'closed' or approved_by = auth.uid())
    and public.app_role() in ('executive', 'pm')
  );

create policy invoices_select on public.invoices
  for select using (public.can_see_project(project_id));

create policy invoices_write on public.invoices
  for all using (
    public.app_role() in ('executive', 'pm')
    and public.can_see_project(project_id)
  ) with check (
    public.app_role() in ('executive', 'pm')
    and public.can_see_project(project_id)
  );

create policy monthly_financials_select on public.monthly_financials
  for select using (
    public.is_executive()
    or (project_id is not null and public.can_see_project(project_id))
  );

create policy documents_select on public.documents
  for select using (public.can_see_project(project_id));

create policy documents_write on public.documents
  for all using (
    public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  ) with check (
    public.app_role() in ('executive', 'pm', 'engineer')
    and public.can_see_project(project_id)
  );

-- Audit trail: read-only, executives and PMs.
create policy audit_select on public.audit_log
  for select using (public.app_role() in ('executive', 'pm'));

-- ----------------------------------------------------------------------------
-- 11. Seed
-- ----------------------------------------------------------------------------
-- Demo users. In production these rows are inserted by the auth trigger below.
-- `auth.users` inserts are omitted here; run `supabase/auth/seed.sql` or sign up
-- through the app, then map ids in public.profiles.
insert into public.safety_checklist_items (clause, requirement, standard, status, last_audited) values
  ('ISO 45001 §6.1.2', 'Hazard identification & risk assessment current for all active work fronts', 'ISO 45001', 'compliant', '2026-11-18'),
  ('ISO 45001 §7.2',   'Competence records for lifting, scaffolding and confined-space operatives', 'ISO 45001', 'compliant', '2026-11-14'),
  ('ISO 45001 §9.1',   'Monthly safety performance review minuted with directors', 'ISO 45001', 'compliant', '2026-11-05'),
  ('OSHA TZ §62',      'Statutory site registration and OSHA 2 returns filed', 'OSHA', 'compliant', '2026-10-30'),
  ('OSHA TZ §88',      'PPE issue register signed by every worker on site', 'OSHA', 'action-required', '2026-11-21'),
  ('Company §3.4',     'Daily 12-point Kifaru verification completed before first shift', 'Company', 'compliant', '2026-11-22'),
  ('Company §3.9',     'SOS drill executed at every active site each quarter', 'Company', 'action-required', '2026-10-12'),
  ('OSHA TZ §105',     'Incident register complete and reported within 24 hours', 'OSHA', 'overdue', '2026-11-22');

insert into public.material_inventory (sku, item_name, category, unit, stock_level, reorder_point, unit_cost, warehouse, last_counted_at) values
  ('STL-RB16', 'Grade 60 Rebar 16 mm', 'structural', 'tonnes', 18, 30, 4500000, 'Ubungo yard', '2026-11-22'),
  ('STL-RB25', 'Marine-grade rebar 25 mm', 'structural', 'tonnes', 46, 40, 5030000, 'Ubungo yard', '2026-11-22'),
  ('CEM-T2',   'Portland Cement Type II', 'structural', 'bags', 1240, 1000, 24000, 'Msasani site', '2026-11-21'),
  ('AGG-20',   'Aggregate 20 mm', 'structural', 'm³', 210, 250, 78000, 'Ubungo yard', '2026-11-20'),
  ('RMC-C40',  'Ready-mix C40/50', 'structural', 'm³', 0, 60, 240000, 'Mwanza batch plant', '2026-11-22'),
  ('STL-SEC',  'Structural steel sections', 'structural', 'tonnes', 84, 50, 6200000, 'Ubungo yard', '2026-11-19'),
  ('FRM-PLY',  'Formwork ply 18 mm', 'structural', 'sheets', 320, 400, 46000, 'Msasani site', '2026-11-21'),
  ('PPE-HV',   'Hi-vis vest & helmet set', 'finishing', 'sets', 148, 120, 32000, 'Ubungo yard', '2026-11-22');

-- ----------------------------------------------------------------------------
-- 12. Profile bootstrap
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role, phone, title)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'client'),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'title'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 13. Reporting views (security invoker → RLS still applies)
-- ----------------------------------------------------------------------------
create or replace view public.project_dashboard
with (security_invoker = true) as
select
  p.id,
  p.project_code,
  p.name,
  p.status,
  p.budget_total,
  p.budget_spent,
  round(p.budget_spent / nullif(p.budget_total, 0) * 100, 1) as budget_utilisation_pct,
  coalesce(round(sum(ph.progress * ph.weight), 0), 0)              as completion_pct,
  p.schedule_variance_days,
  p.workforce,
  p.safe_man_hours,
  count(distinct case when t.status <> 'done' then t.id end)       as open_tasks,
  count(distinct case when i.status <> 'resolved' then i.id end)   as open_incidents
from public.projects p
left join public.phases ph on ph.project_id = p.id
left join public.tasks t on t.project_id = p.id
left join public.safety_incidents_inspections i on i.project_id = p.id
group by p.id;

create or replace view public.low_stock_materials
with (security_invoker = true) as
select id, sku, item_name, unit, stock_level, reorder_point, warehouse,
       round(stock_level / nullif(reorder_point, 0) * 100, 0) as stock_vs_reorder_pct
from public.material_inventory
where stock_level <= reorder_point;
