const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const PostSchema = require('../../models/Post')
// @route api/posts
// @access public
router.get('/', auth, async (req, res) => {
	try {
		const posts = await PostSchema.find().sort({ date: -1 })
		res.json(posts)
	} catch (e) {
		console.log(e.message)
		res.status(500).send('server error')
	}
})

// @route api/posts/:id
// @access public
router.get('/:id', auth, async (req, res) => {
	try {
		const post = await PostSchema.findById(req.params.id)
		res.json(post)
	} catch (e) {
		console.log(e.message)
		res.status(500).send('server error')
	}
})

// @route api/posts
// @access public
router.post('/', auth, async (req, res) => {
	try {
		if (req.body.text.length === 0) return res.send('Text field cannot be empty')
		const newPost = new PostSchema(req.body)
		const post = await newPost.save()
		res.json(post)
	} catch (e) {
		console.log(e.message)
		res.status(500).send('server error')
	}
})

// @route api/posts/:id
// @access public
router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await PostSchema.findById(req.params.id)
		if (post.user.toString() !== req.user.id)
			return res.status(401).send("Can't delete other users post")
		res.send('Post succesfully removed')
	} catch (e) {
		console.log(e.message)
		res.status(500).send('server error')
	}
})

// @route api/like/:id
// @access public
router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await PostSchema.findById(req.params.id)

		if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0)
			return res.status(400).send('post already liked')

		post.likes.unshift({ user: req.user.id })
		await post.save()
		res.send(post.likes)
	} catch (e) {
		console.log(e.message)
		res.status(500).send('server error')
	}
})

// @route api/like/:id
// @access public
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await PostSchema.findById(req.params.id)

		if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0)
			return res.status(400).send('Post has not been liked')

		const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

		post.likes.splice(removeIndex, 1)

		await post.save()
		res.send(post.likes)
	} catch (e) {
		console.log(e.message)
		res.status(500).send('server error')
	}
})

// @route api/posts/comment/:id
// @access public
router.post('/comment/:id', auth, async (req, res) => {
	try {
		if (req.body.text.length === 0) return res.send('Text field cannot be empty')
		const newPost = new PostSchema(req.body)
		const post = await newPost.save()
		res.json(post)
	} catch (e) {
		console.log(e.message)
		res.status(500).send('server error')
	}
})

module.exports = router
