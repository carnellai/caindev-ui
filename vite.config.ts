import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    dts({
      entryRoot: 'src',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      insertTypesEntry: true,
      beforeWriteFile(filePath) {
        if (filePath.endsWith('/styles.d.ts')) return false;
        if (filePath.endsWith('/fonts.d.ts')) return false;
        // Internal utilities must not be deep-importable from the published artifact.
        if (filePath.endsWith('/lib/cn.d.ts')) return false;
        if (filePath.endsWith('/lib/safeJsonStringify.d.ts')) return false;
      },
    }),
    {
      name: 'caindev-ui-remove-styles-entry-js',
      generateBundle(_options, bundle) {
        delete bundle['styles.js'];
        delete bundle['styles.js.map'];
        delete bundle['fonts.js'];
        delete bundle['fonts.js.map'];
      },
    },
  ],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        styles: 'src/styles.css',
        fonts: 'src/fonts.css',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: (id) => (
        id === '@base-ui/react'
        || id.startsWith('@base-ui/react/')
        || id === 'react'
        || id === 'react-dom'
        || id === 'react/compiler-runtime'
        || id === 'react/jsx-runtime'
      ),
    },
    sourcemap: false,
    cssCodeSplit: true,
    emptyOutDir: true,
  },
});
