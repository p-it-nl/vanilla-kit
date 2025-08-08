(() => {
    let lastTimestamp = null;

    console.log('[DEBUG] -- Hot reloading is activated');
    async function checkForReload() {
        try {
            const resp = await fetch('./.lastbuild?_=' + Date.now(), { cache: 'no-store' });
            if (!resp.ok) throw new Error('Failed to fetch .lastbuild');

            const text = await resp.text();
            const serverTimestamp = text.trim();

            if (lastTimestamp && serverTimestamp !== lastTimestamp) {
                console.log('[DEBUG] -- Detected new build. Reloading...');
                location.reload();
            }

            lastTimestamp = serverTimestamp;
        } catch (e) {
            console.warn('[DEBUG] -- Could not check for changes:', e);
        }
    }

    setInterval(checkForReload, 2000);
    checkForReload();
})();