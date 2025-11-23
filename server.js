require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const healthRouter = require('./routes/healthz');
const linksRouter = require('./routes/links');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "'unsafe-inline'"],
        "script-src-attr": ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.json());
app.use(express.static("public"));



const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // limit each IP to 30 requests per minute
  message: { error: 'Too many requests' }
});

app.use(limiter);

app.use('/healthz', healthRouter);
app.use('/api/links', linksRouter);

app.get('/:code', async (req, res) => {
  const code = req.params.code;
  try {
    const r = await db.query('SELECT url FROM links WHERE code = $1', [code]);
    if (r.rowCount === 0) {
      return res.status(404).send('Not found');
    }
    const url = r.rows[0].url;
    await db.query('UPDATE links SET clicks = clicks + 1, last_clicked = now() WHERE code = $1', [code]);
    return res.redirect(302, url);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  try {
    await db.pool.end();
  } catch (e) {}
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`TinyLink Express server listening on port ${PORT}`);
});
