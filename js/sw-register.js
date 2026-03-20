export const registerWorkerService = () => {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('/practica-pwa-twittor/sw.js');
    } else {
        console.warn("Navigator doesn't support ServiceWorkers");
    }
}
