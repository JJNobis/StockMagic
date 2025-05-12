const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const PORT = process.env.PORT || 3000;
const app = express();
const authRouter = require('./src/routers/authRouter');

app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({secret: 'stockMagic'}));


require('./src/config/passport.js')(app)


app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});