import * as esbuild from 'esbuild';
import fs from 'fs';
import zlib from 'zlib';

const shared = {
    bundle: true,
    // без даунлевела: приватные поля и ?? остаются как есть (Safari 15+)
    target: 'es2022',
    legalComments: 'none',
    logLevel: 'warning',
};

const prod = {
    ...shared,
    minify: true,
    // внутренние поля с префиксом _ сокращаются до одной-двух букв
    mangleProps: /^_/,
    define: { __DEV__: 'false' },
};

const dev = {
    ...shared,
    sourcemap: true,
    define: { __DEV__: 'true' },
};

// в отдельном аддоне сигналы берутся из ядра, см. src/shim/signals.js
const coreSignals = {
    alias: { '@preact/signals-core': './src/shim/signals.js' },
};

const builds = [
    { ...prod, format: 'iife', entryPoints: ['src/full.js'], outfile: 'dist/plainly.min.js' },
    { ...prod, format: 'iife', entryPoints: ['src/index.js'], outfile: 'dist/plainly.core.min.js' },
    { ...prod, ...coreSignals, format: 'iife', entryPoints: ['src/addon.js'], outfile: 'dist/plainly.router.min.js' },
    { ...prod, format: 'esm', entryPoints: ['src/full.js'], outfile: 'dist/plainly.min.mjs' },
    { ...dev, format: 'iife', entryPoints: ['src/full.js'], outfile: 'dist/plainly.dev.js' },
];

fs.rmSync('dist', { recursive: true, force: true });

await Promise.all(builds.map(options => esbuild.build(options)));

fs.copyFileSync('src/plainly.d.ts', 'dist/plainly.d.ts');

const kb = n => (n / 1024).toFixed(2).padStart(6) + ' KB';

console.log('file                      min        gzip      brotli');

for (const { outfile } of builds) {
    const code = fs.readFileSync(outfile);

    console.log(
        outfile.padEnd(24),
        kb(code.length),
        kb(zlib.gzipSync(code, { level: 9 }).length),
        kb(zlib.brotliCompressSync(code).length)
    );
}

console.log('✅ Build success');
