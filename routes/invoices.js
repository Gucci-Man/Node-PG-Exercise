/** Routes for invoices. */

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

// GET /invoices : Returns list of invoices
router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM invoices`);
      return res.json({ invoices: results.rows })
    } catch (e) {
      return next(e);
    }
})

// GET /invoices/[id] : Return obj of an invoice:
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with code of ${id}`, 404)
        }
        return res.json({ invoice: results.rows[0] })
    } catch (e) {
        return next(e);
    }
})

// POST /invoices : Adds an invoice. 
router.post('/', async (req, res, next) => {
    try {
        const {comp_code, amt} = req.body;
        const results = await db.query(
            'INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date',
            [comp_code, amt]);
        return res.status(201).json({ invoice: results.rows[0] })
    }   catch (e) {
      return next(e)
    }
})

// PUT /invoices/[id] : Updates an invoice.
// Allow paying of invoices
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt, paid } = req.body;
        let paidDate = null;

        const checkPaid = await db.query('SELECT * FROM invoices WHERE id=$1', [id]);
        if (checkPaid.rows.length === 0) {
            throw new ExpressError(`Can't update invoice with id of ${id}`, 404)
        }

        const currPaidDate = checkPaid.rows[0].paid_date; // Save current paid date if there is one

        if(!currPaidDate && paid) {
            paidDate = new Date();
        } else if(!paid) {
            paidDate = null;
        } else {
            paidDate = currPaidDate;
        }

        const results = await db.query('UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING id, comp_code, amt, paid, add_date, paid_date', 
        [amt, paid, paidDate, id]);
        
        return res.send({ invoice: results.rows[0] })
        } catch (e) {
        return next(e)
    }
})

// DELETE /invoices/[id]
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = db.query('DELETE FROM invoices WHERE id = $1', [id])
        return res.send({ status: "deleted" })
        } catch (e) {
        return next(e)
    }
})

module.exports = router;