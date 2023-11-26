/** Routes for users of companies. */

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

// GET /companies : Returns list of companies
router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM companies`);
      return res.json({ companies: results.rows })
    } catch (e) {
      return next(e);
    }
  })

// GET /companies/[code] : Return obj of company:
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${code}`, 404)
        }
        return res.json({ companies: results.rows[0] })
    } catch (e) {
        return next(e);
    }
  })

// POST /companies : Adds a company.
router.post('/', async (req, res, next) => {
    try {
        console.log(`code to be added is ${code}`);
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', 
        [code, name, description]);
        return res.status(201).json({ company: results.rows[0] })
    }   catch (e) {
      return next(e)
    }
  })


  module.exports = router;