const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(helmet());

let api = require('./routes/api');

app.use('/api', api);

// set port
const port = process.env.PORT || 5200;

// start server
app.listen(port, function(){
    console.log(`Server started on port ${port}...`);
});