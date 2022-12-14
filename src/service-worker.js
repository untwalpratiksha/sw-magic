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

let cacheData = "appV00"; // CACHE_NAME
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
  //     cache.addAll(cacheArray);
  //   })
  // );
});
// Fetching data from cache
self.addEventListener("fetch", (event) => {
  console.log(navigator);
  console.log(event);
  console.log("fetching data from cache");

  //Stale-while-revalidate
  // event.respondWith(
  //   caches.open(cacheData).then(async (cache) => {
  //     return cache.match(event.request).then((cachedResponse) => {
  //       const fetchedResponse = fetch(event.request)
  //         .then((networkResponse) => {
  //           cache.put(event.request, networkResponse.clone());

  //           return networkResponse;
  //         })
  //         .catch(() => {
  //           return cachedResponse;
  //         });

  //       return cachedResponse || fetchedResponse;
  //     });
  //   })
  // );
  // Use if you want to fetch cache first online later
  event.respondWith(
    caches.open(cacheData).then(async (cache) => {
      // Go to the cache first
      return cache.match(event.request.url).then((cachedResponse) => {
        // Return a cached response if we have one
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, hit the network
        return fetch(event.request).then((fetchedResponse) => {
          // Add the network response to the cache for later visits
          cache.put(event.request, fetchedResponse.clone());

          // Return the network response
          return fetchedResponse;
        });
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  // event.waitUntil(
  //   (async () => {
  //     // Enable navigation preload if it's supported.
  //     // See https://developers.google.com/web/updates/2017/02/navigation-preload
  //     if ("navigationPreload" in self.registration) {
  //       await self.registration.navigationPreload.enable();
  //     }
  //     return;
  //   })()
  // );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});
