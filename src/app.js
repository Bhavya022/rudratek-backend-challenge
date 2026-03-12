const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/error');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });


const auth = require('./routes/auth');
const projects = require('./routes/projects');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(helmet());

app.use(cors());

app.use('/api/v1/auth', auth);
app.use('/api/v1/projects', projects);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Rudratek Project Management API'
    });
});

app.use(errorHandler);


module.exports = app;
