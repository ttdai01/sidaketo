import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express from 'express';
import axios from 'axios';
import routes from './routes';

// global configuration axios
axios.defaults.timeout = 30 * 1000;

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

// To serve static files such as images, CSS files, and JavaScript files,
// use the express.static built-in middleware function in Express.
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/api', routes);

export default app;
