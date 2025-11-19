import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 3000
const distPath = resolve(__dirname, 'dist')

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
}

function getMimeType(filePath) {
  const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

const server = createServer((req, res) => {
  let filePath = join(distPath, req.url === '/' ? 'index.html' : req.url)
  
  // Remove query string
  filePath = filePath.split('?')[0]
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(distPath)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }
  
  if (!existsSync(filePath)) {
    // For SPA routing, serve index.html for non-existent files
    filePath = join(distPath, 'index.html')
  }
  
  try {
    const content = readFileSync(filePath)
    const mimeType = getMimeType(filePath)
    
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000'
    })
    res.end(content)
  } catch (error) {
    res.writeHead(404)
    res.end('File not found')
  }
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Serving files from ${distPath}`)
})

