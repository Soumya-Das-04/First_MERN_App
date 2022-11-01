const express = require('express')
const connectDB = require('./config/db');
const { use } = require('./routes/api/auth');



const app = express()

//Connect Database
connectDB();

//Init
app.use(express.json({extended: false}))


app.get('/', (req,res) => res.send("API Running"))

//Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))

const PORT = process.env.port || 5000

app.listen(PORT, () => console.log('server started on port',PORT))

