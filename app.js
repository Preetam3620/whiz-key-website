const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const jsdom = require('jsdom')

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-preetam:pam%21%40%23QW@cluster0-bq71x.mongodb.net/IoTDB", () => {
    console.log('Connected to Mongo DB Successfully!!');
 },
  { useNewUrlParser: true, useUnifiedTopology: true, }
);

// cycleSchema is structure of all values that are present in one cycle and their respective data types.
const cycleSchema = new mongoose.Schema({
  Criteria: String,
  GearBox1: String,
  GearBox2: String,
  GearBox3: String,
  Mixer1: String,
  Mixer2: String,
  Mixer3: String,
  WaterMixer1: String,
  WaterMixer2: String,
  WaterMixer3: String,
  Temp: String,
  Weight: String,
  Status: String,
});

// reportSchema is the structure of a report having n number of cycles
const reportSchema = new mongoose.Schema({
  cycles: [cycleSchema],
  productNumber: String,
  status: Boolean,
  date: String,
  time: String,
  WaterFillingTime: String,
  WaterHeatingTime: String,
});

const Report = mongoose.model("reports", reportSchema);

function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

// Summary Reports of the day
app.get("/", function (req, res) {
  today = getToday();
  Report.find({ date: today.toString() }, function (err, reports) {
    // console.log(reports);
    res.render("summary-report", {
      allReports: reports,
      title: 'Today\'s Reports',
    });
  });
});

// Summary between dates
app.post('/summary-between-dates', (req, res) => {
  const _startDate = req.body.idate1;
  const _endDate = req.body.idate2;
  Report.find({date: {$gte: _startDate, $lte: _endDate}}, (err, reports) => {
    res.render("summary-report", {
      allReports: reports,
      title: 'Reports between ' + _startDate + ' to ' + _endDate,
    });
  });
});

// Latest Detailed Report
app.get("/latest-detailed-report", (req, res) => {  
  today = getToday();
  Report.findOne({}, (err, report) => {
    res.render("detailed-report", {
      productNumber: report.productNumber,
      cycles: report.cycles,
      status: report.status,
      wft: report.wft,
      wht: report.wht,
      time: report.time,
      date: report.date,
    });
  }).sort( {time: -1});
});

// Report of the fail
app.get("/detailed-report/:id", (req, res) => {
  const _id = req.params.id;
  Report.findById(_id, (err, report) => {
    res.render("detailed-report", {
      productNumber: report.productNumber,
      cycles: report.cycles,
      status: report.status,
      wft: report.wft,
      wht: report.wht,
      time: report.time,
      date: report.date,
    });
  });
});

// Detailed Report of specific product
app.post('/product-detailed-report', (req, res) => {
  const _productNumber = req.body.productNumber;

  Report.findOne({productNumber: _productNumber}, (err, report) => {
    if(report != null) {
      res.render("detailed-report", {
        productNumber: report.productNumber,
        cycles: report.cycles,
        status: report.status,
        wft: report.wft,
        wht: report.wht,
        time: report.time,
        date: report.date,
      });
    } else {
      res.redirect("/")
    }
  }).sort( {time: -1});

});


app.listen(process.env.PORT || 3000, () => console.log("___Server has started sucessfully."));
