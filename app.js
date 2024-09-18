const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes/api/books');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/books', routes);


// Connect Database
connectDB();

app.get('/', (req,res)=>
    res.send('Hello World'));

 const port = process.env.PORT || 8082;
 app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)});   