const express = require('express')
const connectDB = require('./config/db')

const app = express()

connectDB()

app.get('/', (req, res) => {
	res.send('it works!')
})

//routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/users'))

port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started on ${port}`))
