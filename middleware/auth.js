const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req, res, next) {
	const token = req.header('x-auth-token')

	if (!token) return error401(res)

	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'))
		req.user = decoded.user
		next()
	} catch {
		error401(res)
	}
}

const error401 = res => {
	return res.status(401).json({ msg: 'Authorization failed' })
}
