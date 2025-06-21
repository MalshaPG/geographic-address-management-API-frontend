export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    server: command === 'serve' ? {
      port: 3000,
      proxy: {
        '/tmf-api': {
          target: 'http://localhost:80',
          changeOrigin: true,
          secure: false,
        }
      }
    } : undefined
  }
})
