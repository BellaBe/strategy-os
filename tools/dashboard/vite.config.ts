import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const projectRoot = path.resolve(__dirname, '..', '..')

export default defineConfig({
  plugins: [
    react(),
    // Serve strategy/hypotheses.md from project root at /hypotheses.md
    {
      name: 'serve-strategy',
      configureServer(server) {
        server.middlewares.use('/hypotheses.md', (_req, res) => {
          const fs = require('fs')
          const filePath = path.join(projectRoot, 'strategy', 'hypotheses.md')
          try {
            const content = fs.readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'text/markdown')
            res.end(content)
          } catch {
            res.statusCode = 404
            res.end('Not found')
          }
        })
      },
    },
  ],
})
