/** Routes for industries. */

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

// GET /industries : Returns list of industries along with company codes associated with them
router.get('/', async (req, res, next) => {
    try {
        const total = [] // Array to hold the industry-company objects          
        let company_codes = []; // Array of company codes for each industry

        // Get all industry codes first
        const industry_results = await db.query(`SELECT code FROM industries`);
        let industry_arr = industry_results.rows.map(r => r.code); // Array to hold all industries 
        
        // Iterate through each industry to find the corresponding company codes
        for (let i of industry_arr) {
            const company_results = await db.query(`SELECT c.code
            FROM companies AS c
            JOIN company_industry AS ci
            ON c.code = ci.company_code
            WHERE ci.industry_code = $1;`, [i])

            // Create array of company codes for each industry then push them to total array
            company_codes = company_results.rows.map(r => r.code)
            total.push({industry: i, companies: company_codes})
        }

        return res.json( total )
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

// POST /industries/[industry_code]/[company_code]: Adds an industry association with a company
// Use URL request parameters 
// i.e /industries/eng/ibm
router.post('/:industry_code/:company_code', async (req, res, next) => {
    try {
        const {company_code, industry_code} = req.params;
        const results = await db.query('INSERT INTO company_industry (industry_code, company_code) VALUES ($1, $2) RETURNING industry_code, company_code', 
        [industry_code, company_code]);
        return res.status(201).json({ industry_company: results.rows[0] })
    }   catch (e) {
      return next(e)
    }
  })


module.exports = router;