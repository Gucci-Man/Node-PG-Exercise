/** Routes for industries. */

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

// GET /industries : Returns list of industries
router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM industries`);
      return res.json({ industries: results.rows })
    } catch (e) {
      return next(e);
    }
  })

// POST /industries: Adds a industry
// Send a JSON body request with code and industry 
// i.e "acct" and "Accounting"
router.post('/', async (req, res, next) => {
    try {
        const {code, industry} = req.body;
        const results = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry', 
        [code, industry]);
        return res.status(201).json({ industry: results.rows[0] })
    }   catch (e) {
      return next(e)
    }
  })


module.exports = router;