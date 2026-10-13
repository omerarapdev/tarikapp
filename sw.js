const CACHE = 'tarikapp-v2-5';
const FILES = ['./', './index.html', './app.js', './styles.css', './bank.js', './vocabulary.js', './stories.js', './more-stories.js', './written-answers.js', './engine.js', './storage.js', './icon.svg', './manifest.webmanifest'].map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('tarikapp-v2-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.registration.scope)) return;
  // Revalidate the HTTP cache as well as our offline cache. Pages assets can
  // otherwise stay stale after a deployment even when the child refreshes.
  event.respondWith(fetch(event.request, { cache: 'no-cache' }).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(async () => (await caches.match(event.request)) || (event.request.mode === 'navigate' ? caches.match(new URL('./index.html', self.registration.scope).href) : Response.error())));
});
