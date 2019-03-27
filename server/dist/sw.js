self.addEventListener('install', function(e) {
  console.log(e)

  e.waitUntil(
    caches.open('test').then(function(cache) {
      return cache.addAll(['/'])
    })
  )
})

self.addEventListener('fetch', function(event) {
  console.log(event.request.url)

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
    })
  )

  if (
    event.request.url.includes('/images/') ||
    event.request.url.includes('/css/')
  ) {
    event.waitUntil(
      caches.open('test').then(function(cache) {
        return cache.addAll([event.request.url])
      })
    )
  }
})
