import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import removeConsole from 'vite-plugin-remove-console'
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/assets/element/index.scss" as *;`,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5179,
  },
  plugins: [
    vue(),
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
      ? removeConsole()
      : null,
    unocss(),
    Components({
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/components.d.ts',
    }),
  ],
  ssr: {
    noExternal: ['element-plus'],
  },
})
