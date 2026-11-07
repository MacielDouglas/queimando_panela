/**
 * Kill switch de service worker.
 *
 * Este projeto não usa service worker. Se alguma versão anterior (ou uma
 * extensão do navegador) registrou um em `/sw.js`, o browser continua
 * checando esse arquivo e recebia 404 a cada carregamento.
 *
 * Este arquivo faz o desregistro e limpa caches antigos. Como não tem
 * handler de `fetch`, ele não intercepta nem cacheia nada.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        try {
          await client.navigate(client.url);
        } catch {
          // Ignora clientes que não permitem navegação.
        }
      }
    })(),
  );
});
