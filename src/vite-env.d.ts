/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare global {
	interface ImportMetaEnv {
		readonly VITE_API_URL: string;
	}
}

export {};
