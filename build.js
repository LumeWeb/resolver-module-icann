import esbuild from "esbuild"

esbuild.buildSync({
    entryPoints: ['src/index.ts'],
    outfile: 'dist-module/index.js',
    format: 'iife',
    bundle: true,
    legalComments: 'external',
    //  minify: true
    tsconfig: "tsconfig.module.json",
    define: {
        'global': 'self'
    }
})
