export const registerWorkerService = () => {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('../sw.js');
    } else {
        console.warn("Navigator doesn't support ServiceWorkers");
    }
}
