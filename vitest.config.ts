import { defineConfig } from 'vitest/config';

const dir = (p: string) => new URL(p, import.meta.url).pathname;

export default defineConfig({
	test: {
		include: ['tests/unit/**/*.test.ts', 'tests/crypto-vectors/**/*.test.ts'],
		environment: 'node'
	},
	resolve: {
		alias: {
			'$env/dynamic/private': dir('./tests/stub/env-dynamic-private.ts'),
			'$app/environment': dir('./tests/stub/app-environment.ts'),
			$crypto: dir('./src/lib/crypto'),
			$components: dir('./src/lib/components'),
			$lib: dir('./src/lib')
		}
	}
});
