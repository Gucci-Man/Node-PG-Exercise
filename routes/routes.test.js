// Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
let testInvoice;
let testIndustry;
beforeEach(async () => {
  const company_result = await db.query(`INSERT INTO companies (code, name, description) 
  VALUES ('abc', 'ABC Studios', 'Broadcast Station') 
  RETURNING code, name, description`);
  testCompany = company_result.rows[0]

  const invoice_result = await db.query(`INSERT INTO invoices (comp_code, amt) 
  VALUES ('abc', 100) 
  RETURNING id, comp_code, amt, paid, add_date, paid_date`);
  testInvoice = invoice_result.rows[0]

  const industry_result = await db.query(`INSERT INTO industries (code, industry) VALUES ('ent', 'Entertainment') RETURNING code, industry`);
  testIndustry = invoice_result.rows[0]
})

afterEach(async () => {
  await db.query(`DELETE FROM companies`)
  await db.query(`DELETE FROM invoices`)
  await db.query(`DELETE FROM industries`)
})

afterAll(async () => {
  await db.end()
})

describe("GET /companies", () => {
    test("Get a list with one company", async () => {
      const res = await request(app).get('/companies')
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ companies: [testCompany] })
    })
  })

describe("GET /companies/:code", () => {
    test("Get a single company", async () => {
      const res = await request(app).get(`/companies/${testCompany.code}`)
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ company: testCompany, industries: [null] })
    })
    test("Responds with 404 for invalid company code", async() => {
        const res = await request(app).get(`/companies/0`)
        expect(res.statusCode).toBe(404);
    })
  })

describe("POST /companies", () => {
    test("Creates a single company", async () => {
      const res = await request(app).post('/companies').send({ name: 'SpaceX', description: 'Aerospace company' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        company: { code: 'spacex', name: 'SpaceX', description: 'Aerospace company' }
      })
    })
  })

describe("PUT /companies/:code", () => {
    test("Updates a single company", async () => {
      const res = await request(app).put(`/companies/${testCompany.code}`).send({ name: 'NBC', description: 'National Broadcasting Company' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        company: { code: 'abc', name: 'NBC', description: 'National Broadcasting Company' }
      })
    })
    test("Responds with 404 for invalid company code", async() => {
        const res = await request(app).put(`/companies/0`).send({ name: 'NBC', description: 'National Broadcasting Company' })
        expect(res.statusCode).toBe(404);
    })
  })

  describe("DELETE /companies/:code", () => {
    test("Deletes a single company", async () => {
      const res = await request(app).delete(`/companies/${testCompany.code}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ status: 'deleted' })
    })
  })

