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
      },
    }),
    {
      name: 'caindev-ui-remove-styles-entry-js',
      generateBundle(_options, bundle) {
        delete bundle['styles.js'];
        delete bundle['styles.js.map'];
      },
    },
  ],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        styles: 'src/styles.css',
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
    sourcemap: true,
    cssCodeSplit: true,
    emptyOutDir: true,
  },
});
