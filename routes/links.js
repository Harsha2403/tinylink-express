const express = require('express');
const router = express.Router();
const db = require('../db');
const { validUrl, validCode, randomCode } = require('../utils/validators');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT code, url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { url, code } = req.body || {};
  if (!url || !validUrl(url)) {
    return res.status(400).json({ error: 'Invalid url' });
  }

  let chosenCode = code;

  try {
    if (chosenCode) {
      if (!validCode(chosenCode)) {
        return res.status(400).json({ error: 'Code must match [A-Za-z0-9]{6,8}' });
      }
      const exists = await db.query('SELECT 1 FROM links WHERE code = $1', [chosenCode]);
      if (exists.rowCount > 0) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      const maxAttempts = 8;
      let attempt = 0;
      while (attempt < maxAttempts && !chosenCode) {
        const candidate = randomCode(6);
        const r = await db.query('SELECT 1 FROM links WHERE code = $1', [candidate]);
        if (r.rowCount === 0) chosenCode = candidate;
        attempt++;
      }
      if (!chosenCode) {
        for (let i = 0; i < 6 && !chosenCode; i++) {
          const candidate = randomCode(8);
          const r = await db.query('SELECT 1 FROM links WHERE code = $1', [candidate]);
          if (r.rowCount === 0) chosenCode = candidate;
        }
      }
      if (!chosenCode) {
        return res.status(500).json({ error: 'Could not generate unique code' });
      }
    }

    await db.query(
      'INSERT INTO links(code, url, clicks, created_at) VALUES($1, $2, 0, now())',
      [chosenCode, url]
    );

    const result = { code: chosenCode, url, clicks: 0 };
    res.status(201).json(result);
  } catch (err) {
    console.error('POST /api/links error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:code', async (req, res) => {
  const code = req.params.code;
  try {
    const r = await db.query(
      'SELECT code, url, clicks, last_clicked, created_at FROM links WHERE code = $1',
      [code]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:code', async (req, res) => {
  const code = req.params.code;
  try {
    const r = await db.query('DELETE FROM links WHERE code = $1 RETURNING code', [code]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
