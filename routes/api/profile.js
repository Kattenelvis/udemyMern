const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')

// @route api/profile/me
// @desc Get current user profile
// @access Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
			'name',
			'avatar'
		])
		if (!profile)
			return res.status(400).json({ msg: 'There is no profile for this user' })

		res.json(profile)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

// @route api/profile/me
// @desc Post current user profile
// @access Private

router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is required')
				.not()
				.isEmpty(),
			check('skills', 'Skills is required')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

		const profile = req.body
		const profileFields = {
			...profile,
			skills: profile.skills.split(',').map(skill => skill.trim())
		}
		profileFields.user = req.user.id
		try {
			let profile = await Profile.findOne({ user: req.user.id })

			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				)
				return res.json(profile)
			}

			profile = new Profile(profileFields)
			await profile.save()
			res.json(profile)
		} catch (e) {
			console.error(e.message)
			res.status(500).send('Server Error')
		}
	}
)

// @route api/profile/me
// @desc get all user profile
// @access Public

router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar'])
		res.json(profiles)
	} catch (e) {
		console.error(e.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
