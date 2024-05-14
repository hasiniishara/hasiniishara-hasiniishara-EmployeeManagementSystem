require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const authRoutes = require('./routes/authRoute')
const passportConfig = require('./middleware/passportConfig')

const app = express();

passportConfig(passport);

// middle ware
app.use(express.json());
app.use(passport.initialize())

app.use((req, res, next)=>{
  console.log(req.path, req.method)
  next()
})


// routes
app.use('/api/auth', authRoutes)

// Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("app running on PORT 3000");
    });
  })
  .catch((error) => {
    console.log("the error", error);
  });
