import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
	plugins: [react(), svgr()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@store': path.resolve(__dirname, './src/store'),
			'@styles': path.resolve(__dirname, './src/styles'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@types': path.resolve(__dirname, './src/types'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {},
		},
	},
	server: {
		port: 3000,
		host: true,
	},
});
