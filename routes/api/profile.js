const express = require('express')
const router = express.Router()

// @route api/profile
// @access public
router.get('/', (req, res) => res.send('prooofilleeee'))

module.exports = router
