const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const cors = require("cors");

const puppeteer = require("puppeteer");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(express.static("public"));

// ================= DB CONNECTION =================

mongoose.connect(process.env.MONGO_URL)

.then(() => console.log("MongoDB Connected"))

// ================= SCHEMA =================

const Quote = mongoose.model("Quote", new mongoose.Schema({

  clientName: String,

  address: String,

  housekeeping: Number,

  supervisor: Number,

  total: Number,

  gst: Number,

  grandTotal: Number,

  date: String

}));

// ================= SAVE API =================

app.post("/save", async (req, res) => {

  try {

    await new Quote(req.body).save();

    res.send("Saved");

  } catch (err) {

  }

});

// ================= PDF API =================

app.post("/pdf", async (req, res) => {

  try {

    const d = req.body;

    const browser = await puppeteer.launch({

      args: ["--no-sandbox", "--disable-setuid-sandbox"] //

    });

    const page = await browser.newPage();

    const html = `
<html>
<head>
<style>

      body { font-family: Arial; padding: 20px; }

      .header {

        display: flex;

        justify-content: space-between;

        align-items: center;

      }

      .logo {

        font-size: 26px;

        font-weight: bold;

        color: #7a2cff;

      }

      .right {

        text-align: right;

        font-size: 12px;

      }

      .box {

        border: 1px solid black;

        margin-top: 10px;

        padding: 10px;

      }

      table {

        width: 100%;

        border-collapse: collapse;

        margin-top: 10px;

      }

      th, td {

        border: 1px solid black;

        padding: 6px;

      }

      th {

        background: #f0f0f0;

      }

      .red {

        color: red;

        font-weight: bold;

      }

      h4 { margin-top: 15px; }
</style>
</head>
<body>
<div class="header">
<div>
<div class="logo">VIGNU ENTERPRISES</div>
<div>GST NO: 33BCKPV5857M2ZP</div>
</div>
<div class="right">
<div>📞 8056132137</div>
<div>✉ vignuenterprises@gmail.com</div>
<div>32B Natesan Nagar, Madhavaram, Chennai</div>
</div>
</div>
<div class="box">
<b>To:</b> ${d.clientName}<br>

      ${d.address}<br>
<b>Date:</b> ${d.date}
</div>
<table>
<tr><th>Description</th><th>Amount (INR)</th></tr>
<tr><td>Monthly Housekeeping Charges</td><td>${d.housekeeping}</td></tr>
<tr><td>Supervisor Charges</td><td>${d.supervisor}</td></tr>
<tr class="red"><td>Total</td><td>${d.total}</td></tr>
<tr><td>GST 18%</td><td>${d.gst}</td></tr>
<tr class="red"><td>Grand Total</td><td>${d.grandTotal}</td></tr>
</table>
<h4>Manpower Deployment</h4>
<ul>
<li>Housekeeping Staff: 6</li>
<li>Supervisor: 1</li>
</ul>
<h4>Scope of Services</h4>
<ul>
<li>Cleaning of floors, workspace</li>
<li>Dusting & sanitization</li>
<li>Garbage disposal</li>
<li>Pantry maintenance</li>
</ul>
<h4>Total Cost Calculation</h4>
<table>
<tr><th>Component</th><th>Amount</th></tr>
<tr><td>Gross Salary</td><td>15500</td></tr>
<tr><td>EPF</td><td>1860</td></tr>
<tr><td>ESI</td><td>503.75</td></tr>
<tr><td>Bonus</td><td>1240</td></tr>
<tr><td>Total</td><td>19103.75</td></tr>
</table>
<h4>Supervisor Cost Calculation</h4>
<table>
<tr><th>Component</th><th>Amount</th></tr>
<tr><td>Gross Salary</td><td>18000</td></tr>
<tr><td>EPF</td><td>2160</td></tr>
<tr><td>ESI</td><td>585</td></tr>
<tr><td>Bonus</td><td>1440</td></tr>
<tr><td>Total</td><td>22185</td></tr>
</table>
<h4>Terms & Conditions</h4>
<ul>
<li>12 months contract</li>
<li>Monthly payment</li>
<li>8 hrs/day, 6 days/week</li>
<li>Taxes extra</li>
</ul>
</body>
</html>

    `;

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({

      format: "A4",

      printBackground: true

    });

    await browser.close();

    res.set({

      "Content-Type": "application/pdf",

      "Content-Disposition": "inline; filename=quotation.pdf"

    });

    res.send(pdf);

  } catch (err) {

    console.log(err);

  }

});

// ================= SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("🚀 Server running on port " + PORT));
 
