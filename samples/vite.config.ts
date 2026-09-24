import vue from '@vitejs/plugin-vue';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, type Plugin } from 'vite';
import pkg from '../package.json' with { type: 'json' };

/**
 * Mock upload API: POST /api/upload
 * - Upload speed limited to about 2 MB/s to see the progress
 * - Success response: { files: ["name.png", ...] }
 * - A file with "error" in its name returns an HTTP 500 error
 * @returns
 */
function mockUploadApi(): Plugin {
	return {
		name: 'kn-upload-mock-api',
		configureServer(server) {
			server.middlewares.use('/api/upload', (req: IncomingMessage, res: ServerResponse) => {
				if (req.method != 'POST') {
					res.statusCode = 405;
					res.end();
					return;
				}

				const chunks: Buffer[] = [];

				req.on('data', (chunk: Buffer) => {
					chunks.push(chunk);

					// Slow down the upload
					req.pause();
					setTimeout(() => req.resume(), chunk.length / 2000);
				});

				req.on('end', () => {
					const body = Buffer.concat(chunks).toString('latin1'),
						files = [...body.matchAll(/filename="([^"]*)"/g)].map(m => m[1] ?? ''),
						error = files.some(name => name.includes('error'));

					res.statusCode = error ? 500 : 200;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(error ? { error: 'Simulated server error' } : { files }));
				});
			});
		}
	};
}

/**
 * Samples dev server (pnpm samples)
 * - http://localhost:5173/samples/vue/ Vue 3 sample (sources of KnUpload)
 * - http://localhost:5173/samples/index.html Browser script sample (dist, pnpm build first)
 * - http://localhost:5173/samples/esm.html ES module sample (dist, pnpm build first)
 */
export default defineConfig({
	plugins: [vue(), mockUploadApi()],
	define: {
		__KN_UPLOAD_VERSION__: JSON.stringify(pkg.version)
	},
	resolve: {
		// The Vue sample imports the sources of KnUpload
		alias: [
			{ find: /^kn-upload\/vue$/, replacement: '/src/vue.ts' },
			{ find: /^kn-upload$/, replacement: '/src/kn-upload.ts' }
		]
	},
	server: {
		open: '/samples/vue/'
	}
});
