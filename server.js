'use strict';

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = new(require('express'))();
const port = 3000;

const JWT_SECRET = 'secret-key';
const JWT_TTL_SECONDS = parseInt(process.env.JWT_TTL_SECONDS, 10) || 300;

const config = require('./webpack.config');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());

app.post('/auth/getToken/', (req, res) => {
    if (req.body.email == 'hello@test.com' && req.body.password == 'test') {
        const token = jwt.sign(
            { userName: 'Test User' },
            JWT_SECRET,
            { expiresIn: JWT_TTL_SECONDS }
        );
        res.status(200).json({ token });
    } else {
        res.sendStatus(403);
    }
});

app.get('/getData/', (req, res) => {
    let token = req.headers['authorization'];
    if (!token) {
        res.sendStatus(401);
    } else {
        try {
            let decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
            res.status(200)
                .json({data: 'Valid JWT found! This protected data was fetched from the server.'});
        } catch (e) {
            res.sendStatus(401);
        }
    }
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
    }
});
