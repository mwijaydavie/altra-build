import { NextResponse } from "next/server";
import { rfqSchema } from "@/lib/validation";

export const runtime = "nodejs";

function reference(): string {
  const year = new Date().getUTCFullYear();
  const serial = String(Date.now()).slice(-5);
  return `AB/RFQ/${year}-${serial}`;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = rfqSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const ref = reference();

  // Production integration point: push to CRM, email the tender desk, open a
  // SharePoint folder. Kept side-effect free in this environment.
  console.info("[rfq] received", {
    reference: ref,
    discipline: parsed.data.discipline,
    area: parsed.data.area,
    location: parsed.data.location,
    organisation: parsed.data.organisation,
  });

  return NextResponse.json(
    {
      reference: ref,
      receivedAt: new Date().toISOString(),
      acknowledgementSlaHours: 2,
      tenderSlaDays: 10,
    },
    { status: 201 },
  );
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
