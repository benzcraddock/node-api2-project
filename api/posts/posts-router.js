// implement your posts router here
const express = require('express')

const Posts = require('./posts-model')

const router = express.Router()

// POSTS ENDPOINT
// POSTS ENDPOINT
// POSTS ENDPOINT

// GET POSTS
router.get('/', (req, res) => {
  console.log('posts router is working :)!')
  Posts.find()
    .then(posts => {
      res.json(posts)
    })
    .catch(() => {
      res.status(500).json({
        message: 'The posts information could not be retrieved'
      })
    })
})

// GET POSTS BY ID
router.get('/:id', (req, res) => {
  let { id } = req.params
  Posts.findById(id)
    .then(post => {
      if(!post) {
        res.status(404).json({
          message: 'The post with the specified ID does not exist'
        })
      } else {
        res.json(post)
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'The post information could not be retrieved'
      })
    })
})

// POST TO POSTS
router.post('/', (req, res) => {
  const { title, contents } = req.body
  if(!title || !contents) {
    res.status(400).json({
      message: 'Please provide title and contents for the post'
    })
  } else {
    Posts.insert({ title, contents })
      .then(({ id }) => {
        return Posts.findById(id)
      })
      .then(post => {
        res.status(201).json(post)
      })
      .catch(err => {
        res.status(500).json({
          message: 'There was an error while saving the post to the database',
          err: err.message,
          stack: err.stack
        })
      })
    }
})

// PUT POST
router.put('/:id', (req, res) => {
  const post = req.body
  if(!post.title || !post.contents) {
    res.status(400).json({
      message: 'Please provide title and contents for the post'
    })
  } else {
    Posts.findById(req.params.id)
      .then(stuff => {
        if(!stuff) {
          res.status(404).json({
            message: "The post with the specified ID does not exist"
          })
        } else {
          return Posts.update(req.params.id, req.body);
        }
      })
      .then(data => {
        if(data) {
          return Posts.findById(req.params.id)
        }
      })
      .then(post => {
        if(post) {
          res.json(post);
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "The post information could not be modified",
          err: err.message,
          stack: err.stack,
        })
      })
  }
})

// BUILD DELETE ENDPOINT
router.delete('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if(!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist"
      })
    } else {
      await Posts.remove(req.params.id);
      res.json(post);
    }
  }
  catch(err) {
    res.status(500).json({
      message: "The post could not be removed",
      err: err.message,
      stack: err.stack,
    })
  }
})

// BUILD FINAL GET ENDPOINT FOR COMMENTS
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if(!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist"
      })
    } else {
      const comments = await Posts.findPostComments(req.params.id);
      res.json(comments);
    }
  }
  catch(err) {
    res.status(500).json({
      message: "The comments information could not be retrieved",
      err: err.message,
      stack: err.stack,
    })
  }
})

module.exports = router
