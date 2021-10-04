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

const cycleSchema = new mongoose.Schema({
  Action1: String,
  Weight1: String,
  Temp1: String,
  Action2: String,
  Motor1_Dir: String,
  Motor1_Status: String,
  Channel1_Status: String,
  Weight2: String,
  Temp2: String,
  Action3: String,
  Motor2_Dir: String,
  Motor2_Status: String,
  Channel2_Status: String,
  Weight3: String,
  Temp3: String,
  Action4: String,
  Weight4: String,
  Temp4: String,
  Action5: String,
  Weight5: String,
  Temp5: String,
  Action6: String,
  Weight6: String,
  Temp6: String,
  Status: String,
});


const reportSchema = new mongoose.Schema({
  cycles: [cycleSchema],
  productNumber: String,
  status: Boolean,
  date: String,
  time: String,
});

const Report = mongoose.model("reports", reportSchema);


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
  Report.findOne({date: today}, (err, report) => {
    res.render("detailed-report", {
      productNumber: report.productNumber,
      cycles: report.cycles,
      status: report.status,
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
        time: report.time,
        date: report.date,
      });
    } else {
      res.redirect("/")
    }
    
  }).sort( {time: -1});

});


app.listen(process.env.PORT || 3000, () => console.log("___Server has started sucessfully."));

function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}