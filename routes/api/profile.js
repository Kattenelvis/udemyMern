const express = require('express')
const request = require('request')
const config = require('config')
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

// @route api/profile/
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

// @route api/profile/user/:user_id
// @desc get specific user profile
// @access Public

router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [
			'name',
			'avatar'
		])

		if (!profile) return res.status(400).json({ msg: 'No User found' })
		res.json(profile)
	} catch (e) {
		console.error(e.message)
		if (err.kind == 'ObjectId') {
			res.status(400).json({ msg: 'No User found' })
		}
		res.status(500).send('Server Error')
	}
})

// @route api/profile/
// @desc delete profile, user & posts
// @access Private

router.delete('/', auth, async (req, res) => {
	try {
		await Profile.findOneAndRemove({ user: req.user.id })
		await User.findOneAndRemove({ _id: req.user.id })
		res.json({ msg: 'Successfully deleted user' })
	} catch (e) {
		console.error(e.message)
		res.status(500).send('Server Error')
	}
})

// @route api/profile/experience
// @desc Add/Edit profile experience
// @access Private

router.put(
	'/experience',
	auth,
	[
		check('title', 'Title is required')
			.not()
			.isEmpty(),
		check('company', 'Company is required')
			.not()
			.isEmpty(),
		check('from', 'From date is required')
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
		const input = req.body
		addToList(req, res, input, 'experience')
	}
)

router.put(
	'/education',
	auth,
	[
		check('school', 'School is required')
			.not()
			.isEmpty(),
		check('degree', 'Degree is required')
			.not()
			.isEmpty(),
		check('from', 'from date is required')
			.not()
			.isEmpty(),
		check('fieldofstudy', 'Field of study is required')
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
		const input = req.body
		addToList(req, res, input, 'education')
	}
)

const addToList = async (req, res, input, array) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })
		profile[array].unshift(input)
		await profile.save()

		res.json({ profile })
	} catch (e) {
		console.error(e.message)
		res.status(500).send('Server Error')
	}
}

// @route api/profile/experience
// @desc Add/Edit profile experience
// @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
	removeFromList(req, res, 'experience')
})

router.delete('/education/:exp_id', auth, async (req, res) => {
	removeFromList(req, res, 'education')
})

const removeFromList = async (req, res, array) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })
		const removeIndex = profile[array].map(item => item.id).indexOf(req.params.exp_id)

		if (removeIndex === 0) {
			profile[array].splice(removeIndex, 1)
			await profile.save()
			res.json({ profile })
		} else {
			res.status(400).send('Nothing to remove')
		}
	} catch (e) {
		console.error(e.message)
		res.status(500).send('Server Error')
	}
}

// @route api/profile/github/:username
// @desc Get user repos from Github
// @access Public

router.get('/github/:username', (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users${
				req.params.username
			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'githubClientId'
			)}&client_secret=${config.get('githubSecret')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' }
		}

		request(options, (er, resp, body) => {
			if (er) console.error(er)

			if (resp.statusCode !== 200) res.status(404).json({ msg: 'No profile found' })
			res.json(JSON.parse(body))
		})
	} catch (e) {
		res.status(500).send(e)
	}
})

module.exports = router
