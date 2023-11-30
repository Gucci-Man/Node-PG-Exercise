\c biztime_test

DROP TABLE IF EXISTS company_industry;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;


CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text PRIMARY KEY,
  industry text NOT NULL
);

CREATE TABLE company_industry (
  industry_code text NOT NULL REFERENCES industries ON DELETE CASCADE,
  company_code text NOT NULL REFERENCES companies ON DELETE CASCADE
);

/* INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries
  VALUES ('comp', 'Computers'),
         ('aero', 'Aerospace'),
         ('eng', 'Engineering');

INSERT INTO company_industry
  VALUES ('eng', 'ibm'),
         ('comp', 'apple'),
         ('eng', 'apple');
 */