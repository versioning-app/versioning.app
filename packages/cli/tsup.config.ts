import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*.ts', 'src/**/*.tsx'],
	sourcemap: true,
	format: ['esm'],
	target: 'es2022',
	clean: true,
	dts: true,
});
