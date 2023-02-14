import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import postCssPxToRem from 'postcss-px2rem'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [vue()],
    resolve: {
      // 别名
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src'),
      }
    },

    /*
     * envPrefix:  ['VITE', 'VUE'], // 环境变量前缀,默认只会暴露VITE开头变量，定义后可暴露VUE开头变量
     * 拓展
     */
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    // 预处理选项
    preprocessorOptions: {
      less: {
        additionalData: '@import @/assets/css/base.less;',
        javascriptEnabled: true,
      },
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem(
            {
              remUnit: 10
            }
          )
        ]
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: true,
      proxy: {
        '/api': {
          target: 'http://developers.douban.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }

      },
    }
  })
}
