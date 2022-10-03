const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials')
const PORT = process.env.PORT || 3500;
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded


// parse application/json
app.use(bodyParser.json())


app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json());

app.use(cookieParser());

app.use('/register', require('./routes/register'));

app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('logout', require('./routes/logout'));
app.use(verifyJWT);

app.use('/chat', require('./routes/chat'));
app.use('/chess', require('./routes/chess'));



//app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));