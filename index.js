import http from 'http'
import app from './app.js'
import cluster from 'cluster'
import fs from 'fs'
import { availableParallelism } from 'os'

const port = process.env.PORT || 8000
const appEnv = process.env.nodeEnv

if (!fs.existsSync('./temp')) {
  fs.mkdir('./temp', (e) => {
    if (e) console.log(e.message)
    fs.mkdir('./temp/uploads', (e) => {
      if (e) console.log(e.message)
      console.log('Uploads Folder Created')
    })
    fs.mkdir('./temp/downloads', (e) => {
      if (e) console.log(e.message)
      console.log('Downloads Folder Created')
    })
  })
}

if (appEnv === 'production') {
  const numCPU = availableParallelism()
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)
    for (let i = 0; i < numCPU; i++) {
      cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`)
    })
  } else {
    const server = http.createServer(app)
    server.listen(port)
    server.on('listening', () => console.log(`Listening on ${port}`))
    server.on('close', () => console.log('Server Shutting Down!'))
    server.on('error', (e) => console.log(e.message))
    console.log(`Worker ${process.pid} started`)
  }
} else {
  const server = http.createServer(app)
  server.listen(port)
  server.on('listening', () => console.log(`Listening on ${port}`))
  server.on('close', () => console.log('Server Shutting Down!'))
  server.on('error', (e) => console.log(e.message))
}
