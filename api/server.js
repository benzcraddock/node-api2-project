// implement your server here
const express = require('express')

const server = express()

// require your posts router and connect it here
const postsRouter = require('./posts/posts-router')
server.use('/api/posts', postsRouter)

server.use(express.json())

module.exports = server
