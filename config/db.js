const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		console.log('successful connection to mongoose database')
	} catch {
		console.log("couldn't connect to mongoose database")
		process.exit(1)
	}
}

module.exports = connectDB
