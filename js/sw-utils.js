const updateDynamicCache = (dynamicCacheName, request, response) => {
    if (response.ok) {
        caches.open(dynamicCacheName).then(cache => {
            cache.put(request, response.clone());
            return response.clone();
        });
    } else {
        return response.clone();
    }
}

const cleanOldCacheVersions = (cachePrefix, cacheName) => {
    return caches.keys().then(keys => {
        keys.forEach(key => {
            if (key.includes(cachePrefix) && key !== cacheName) {
                return caches.delete(key);
            }
        });
    });
}