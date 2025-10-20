
// Service Worker لتطبيق كورس اللغة الإنجليزية
const CACHE_NAME = 'english-course-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/progress-system.js',
    '/a1-vocabulary.html',
    '/a1-sentences.html',
    '/a2-vocabulary.html',
    '/a2-sentences.html',
    '/b1-vocabulary.html',
    '/b1-sentences.html',
    '/b2-vocabulary.html',
    '/b2-sentences.html',
    '/pronunciation-guide.html',
    '/progress-tracker.html',
    '/downloads.html'
];

// تثبيت Service Worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('فتح الذاكرة المؤقتة');
                return cache.addAll(urlsToCache);
            })
    );
});

// جلب البيانات
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // إرجاع الملف من الذاكرة المؤقتة إذا وُجد
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

// تحديث Service Worker
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
