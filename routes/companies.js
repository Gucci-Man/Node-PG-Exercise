/** Routes for companies. */

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

const slugify = require('slugify');

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
// Also see names of industries for that company
router.get('/:code', async (req, res, next) => {
    try {
        let industries = [] // if a company has no industries, then start out as empty array
        const { code } = req.params;
        const results = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${code}`, 404)
        }

        // Querying company's industries
        const industry_results = await db.query(`SELECT i.industry
        FROM companies AS c
        LEFT JOIN company_industry AS ci
        ON c.code = ci.company_code
        LEFT JOIN industries AS i
        ON i.code = ci.industry_code
        WHERE c.code = $1`, [code]);

        industries = industry_results.rows.map(r => r.industry)
        return res.json({ company: results.rows[0],
         industries: industries});
    } catch (e) {
        return next(e);
    }
  })

// POST /companies : Adds a company.
// Use slugify() to create company code
router.post('/', async (req, res, next) => {
    try {
        const {name, description} = req.body;
        const code = slugify(name, {
          lower: true
        });
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', 
        [code, name, description]);
        return res.status(201).json({ company: results.rows[0] })
    }   catch (e) {
      return next(e)
    }
  })

// PUT /companies/[code] : Edit existing company.
router.put('/:code', async (req, res, next) => {
  try {
      const { code } = req.params;
      const { name, description } = req.body;
      const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code])
      if (results.rows.length === 0) {
          throw new ExpressError(`Can't update company with code of ${code}`, 404)
      }
      return res.send({ company: results.rows[0] })
      } catch (e) {
      return next(e)
  }
})

// DELETE /companies/[code] : Deletes company.
router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = db.query('DELETE FROM companies WHERE code = $1', [code])
        return res.send({ status: "deleted" })
        } catch (e) {
        return next(e)
    }
})
  
module.exports = router;