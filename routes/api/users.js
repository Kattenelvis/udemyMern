const express = require('express')
const router = express.Router()

// @route api/users
// @access public
router.get('/', (req, res) => res.send('u see r s'))

module.exports = router
