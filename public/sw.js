/* ALTRA FIELD — field-scoped service worker.
   Only intercepts /field navigations and static assets; never touches the
   marketing site or API responses. */
const CACHE = "altra-field-v1";
const SHELL = ["/field", "/brand/icon-192.png", "/brand/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  const isField = url.pathname === "/field" || url.pathname.startsWith("/field/");
  const isAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/brand/") ||
    url.pathname.startsWith("/images/");
  if (!isField && !isAsset) return;

  if (isField) {
    // Network-first for the app shell, cached shell when offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("/field", copy)).catch(() => undefined);
          return response;
        })
        .catch(() => caches.match("/field").then((cached) => cached || Response.error())),
    );
    return;
  }

  // Stale-while-revalidate for hashed assets and local media.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
