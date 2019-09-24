const express = require('express')
const router = express.Router()

// @route api/posts
// @access public
router.get('/', (req, res) => res.send('postman'))

module.exports = router
