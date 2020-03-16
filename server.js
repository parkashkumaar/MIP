const express     = require("express");
const mongoose    = require("mongoose");
const bodyParser  = require("body-parser");
const users       = require("./routers/users");
const jobposts    = require("./routers/jobposts");
const app         = express();
const Port        = 3000 || process.env.Port;
const db = require('./config/keys').mongoURI;
app.use(bodyParser.json());
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log("DB does not connect please connect"));

app.use('/',users);
app.use('/',jobposts)
app.listen(`${Port}`,()=>console.log(`Server Listen on Port ${Port}`))

