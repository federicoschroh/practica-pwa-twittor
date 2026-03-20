importScripts('./js/sw-utils.js');

// CACHE CONFIG

const STATIC_CACHE_PREFIX = "static";
const DYNAMIC_CACHE_PREFIX = "dynamic";
const INMUTABLE_CACHE_PREFIX = "inmutable";

const STATIC_CACHE_VERSION = 'v2';
const DYNAMIC_CACHE_VERSION = 'v2';
const INMUTABLE_CACHE_VERSION = 'v1';

const STATIC_CACHE_NAME = STATIC_CACHE_PREFIX + '-' + STATIC_CACHE_VERSION;
const DYNAMIC_CACHE_NAME = DYNAMIC_CACHE_PREFIX + '-' + DYNAMIC_CACHE_VERSION;
const INMUTABLE_CACHE_NAME = INMUTABLE_CACHE_PREFIX + '-' + INMUTABLE_CACHE_VERSION;

const APP_SHEEL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg ',
    'img/avatars/ironman.jpg ',
    'img/avatars/spiderman.jpg ',
    'img/avatars/thor.jpg ',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',
];

// CACHE EVENTS

self.addEventListener('install', event => {
    const staticCachePromise = caches.open(STATIC_CACHE_NAME).then(cache => {
        cache.addAll(APP_SHEEL);
    });

    const inmutableCachePromise = caches.open(INMUTABLE_CACHE_NAME).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    const cacheReady = Promise.all([
        staticCachePromise,
        inmutableCachePromise
    ]);

    event.waitUntil(cacheReady);
});

self.addEventListener('activate', event => {
    const cacheCleaned = Promise.all([
        cleanOldCacheVersions(STATIC_CACHE_PREFIX, STATIC_CACHE_NAME),
        cleanOldCacheVersions(DYNAMIC_CACHE_PREFIX, DYNAMIC_CACHE_NAME),
        cleanOldCacheVersions(INMUTABLE_CACHE_PREFIX, INMUTABLE_CACHE_NAME),
    ]);

    event.waitUntil(cacheCleaned);
});

self.addEventListener('fetch', event => {
    const response = caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
            return cachedResponse;
        }

        return fetch(event.request).then(fetchResponse => {
            return updateDynamicCache(DYNAMIC_CACHE_NAME, event.request, fetchResponse);
        });
    });


    event.respondWith(response);
})

