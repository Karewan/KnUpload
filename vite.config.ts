import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

const banner = `/**
 * KnUpload v${pkg.version} (${new Date().toISOString()})
 * Copyright (c) 2019 - ${new Date().getFullYear()} Florent VIALATTE
 * Released under the MIT license
 */`;

// KnHttp is not bundled (peer dependency), the IIFE builds use the global KnHttp object
const globals = {
	'kn-http': 'KnHttp'
};

// Core build: ES module, IIFE and minified IIFE
const coreConfig = defineConfig({
	define: {
		__KN_UPLOAD_VERSION__: JSON.stringify(pkg.version)
	},
	build: {
		target: 'es2022',
		outDir: 'dist',
		emptyOutDir: true,
		copyPublicDir: false,
		minify: false,
		lib: {
			entry: 'src/kn-upload.ts',
			name: 'KnUpload'
		},
		rolldownOptions: {
			external: ['kn-http'],
			output: [
				{
					format: 'es',
					entryFileNames: 'kn-upload.js',
					postBanner: banner
				},
				{
					format: 'iife',
					name: 'KnUpload',
					entryFileNames: 'kn-upload.iife.js',
					exports: 'default',
					globals: globals,
					postBanner: banner
				},
				{
					format: 'iife',
					name: 'KnUpload',
					entryFileNames: 'kn-upload.iife.min.js',
					exports: 'default',
					globals: globals,
					minify: {
						compress: {
							dropConsole: true,
							dropDebugger: true
						},
						mangle: true,
						codegen: true
					},
					postBanner: banner
				}
			]
		}
	}
});

// Vue build (vite build --mode vue): ES module only, @karewan/kn-upload, kn-http and vue are external
const vueConfig = defineConfig({
	build: {
		target: 'es2022',
		outDir: 'dist',
		emptyOutDir: false,
		copyPublicDir: false,
		minify: false,
		lib: {
			entry: 'src/vue.ts',
			formats: ['es']
		},
		rolldownOptions: {
			external: ['vue', 'kn-http', '@karewan/kn-upload'],
			output: {
				format: 'es',
				entryFileNames: 'vue.js',
				postBanner: banner
			}
		}
	}
});

export default defineConfig(({ mode }) => mode == 'vue' ? vueConfig : coreConfig);
