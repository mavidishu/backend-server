// Simple Express Server
const connectToMongo = require('./db');
const express = require('express')
const app = express();
const port = 5000  // server listens at port 3000
connectToMongo();

app.use((req,res,next)=>{
  // cors error resolved:
  res.header('Access-Control-Allow-Origin', '*'); // or 'http://localhost:3000'
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept,auth-token'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  next();
},express.json());// Middleware to get response body as json value.

// Routes the different http request to different functionalitites:
app.use('/api/auth', require("./routes/auth")) //handling http request: When a request is made server responds with hello world!
app.use("/api/notes",require('./routes/notes'))


// listen() to start a web server:
app.listen(port, () => {
  console.log(`iNoteBook backend listening on port ${port}`)
})