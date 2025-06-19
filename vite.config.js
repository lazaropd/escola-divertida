import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), purgeCss()],
	ssr: {
		noExternal: ['svelte-chartjs'] // Adiciona svelte-chartjs para ser processado no SSR
	}
});
