const express = require('express')
const connectDB = require('./config/db')

const app = express()

//connect with database 
connectDB()

app.use(express.json({extended: false}))

app.get('/', (req, res) => res.send('API is running'))

app.use('/api/users', require('./routes/api/users'))


const port = process.env.PORT || 5000

app.listen(port, ()=> console.log(`Server is running on ${port}`))