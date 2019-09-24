const express = require('express')
const router = express.Router()

// @route api/auth
// @access public
router.get('/', (req, res) => res.send('hiiiiii authority'))

module.exports = router
