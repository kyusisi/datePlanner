import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const root = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '');
  const port = Number(env.WEB_PORT || 5173);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('WEB_PORT must be between 1 and 65535');
  return {
    envDir: root,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        devOptions: { enabled: false },
        includeAssets: ['icon.svg'],
        manifest: {
          name: 'Date Planner',
          short_name: 'DatePlanner',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          lang: 'ko',
          icons: [
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
          // Future Share Target settings belong here after a receiving route is implemented.
        },
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallbackDenylist: [/^\/api\//],
          // API responses are never cached. Only the built static shell is precached.
          runtimeCaching: [],
        },
      }),
    ],
    server: { port, strictPort: true },
  };
});
