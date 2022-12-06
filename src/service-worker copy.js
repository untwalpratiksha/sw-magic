/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith("/_")) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
// registerRoute(
//   // Add in any other file extensions or routing criteria as needed.
//   ({ url }) =>
//     url.origin === self.location.origin && url.pathname.endsWith(".png"), // Customize this strategy as needed, e.g., by changing to CacheFirst.
//   new StaleWhileRevalidate({
//     cacheName: "images",
//     plugins: [
//       // Ensure that once this runtime cache reaches a maximum size the
//       // least-recently used images are removed.
//       new ExpirationPlugin({ maxEntries: 50 }),
//     ],
//   })
// );

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.

let cacheData = "appV1"; // CACHE_NAME
//set the url which you need to work offline

//NOTE: third party cors not work
const cacheArray = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/service-worker.js",
  "/index.html",
  // "https://jllsa-dev.iwmsapp.com/tririga/p/webapi/rest/v2/peopleReactPU/-1/allPeopleRecordsPU?countOnly=false",
  "https://jsonplaceholder.typicode.com/users",
];
//setting the urls inside cache :install cache
self.addEventListener("install", (event) => {
  console.log("installing cache");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheData);
      // Setting {cache: 'reload'} in the new request will ensure that the response
      // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
      await cache.addAll(cacheArray);
    })()
  );
  // event.waitUntil(
  //   caches.open(cacheData).then((cache) => {
  //      cache.addAll(cacheArray);
  //   })
  // );
});
// Fetching data from cache
self.addEventListener("fetch", (event) => {
  console.log(navigator);
  console.log(event);
  console.log("fetching data from cache");

  event.respondWith(
    (async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        // const preloadResponse = await event.preloadResponse;
        // if (preloadResponse) {
        //   return preloadResponse;
        // }

        let responseCache;
        const cachedResponse = caches
          .match(event.request)
          .catch(() => fetch(event.request))
          .then((r) => {
            responseCache = r;
            caches.open(cacheData).then((cache) => {
              cache.put(event.request, responseCache);
            });
            return responseCache.clone();
          })
          .catch(() => caches.match(event.request));

        // const cachedResponse1 = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        const networkResponse = await fetch(event.request);

        if (cacheArray.some((item) => event.request.url.startsWith(item))) {
          // This clone() happens before `return networkResponse`
          const clonedResponse = networkResponse.clone();

          event.waitUntil(
            (async function () {
              const cache = await caches.open(cacheData);
              // This will be called after `return networkResponse`
              // so make sure you already have the clone!
              await cache.put(event.request, clonedResponse);
            })()
          );
        }
        return networkResponse;
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log("Fetch failed; returning offline page instead.", error);

        const cache = await caches.open(cacheData);
        const cachedResponse = await cache.match(event.request);
        return cachedResponse;
      }
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
      return;
    })()
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});