let request = require('request');
const dotenv =require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const index = express();
index.use(bodyParser.json());


//Calling openweather api for measuring temperature in Covilha
let city = 'Covilha';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.apiKey}`

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body);
    var currTemp = weather.main.temp;
    var country = weather.sys.country;
    var time = Math.floor(Date.now() / 100);
    let message = `It's ${weather.main.temp} degrees in ${weather.name}, ${weather.sys.country}!`;
    console.log(message);
    storeTemperature(city, country, currTemp, time);
  }
});

// Store location, temperature and time of the observation
function storeTemperature(loc, nat, temp,times) {
    var Mongoose = require('mongoose').Mongoose;
    // connect to a db at localhost
    var instace1 = new Mongoose();
    instace1.connect(process.env.DB_SecConnection, 
        { useNewUrlParser: true },
        () =>console.log('connected to database')
        );
    // define the db schema
    var schema = instace1.Schema({ 
       location: String, 
       temperature: String, 
       timestamp: String, 
       nation: String,
    });
    var Temperature =  instace1.model('temperature', schema);
   // Create a new object with the fields initialized by the read data
   var t = new Temperature({
      location: loc, 
      nation: nat,
      temperature: temp, 
      timestamp: times,
      
   })
   // attempt to save the data
   t.save(function(err) {
     if (err) {
        console.log("error saving"); 
     } else {
        console.log("saved to database");   
     }
    });   
 };

 //Import temperature values of Sfax from excel sheet 
 
  var Excel = require('exceljs');
  var wb = new Excel.Workbook();
  var path = require('path');
  var filePath = path.resolve(__dirname,'data.xlsx');
//variables to calculate average temperature
  var avgTemp;
  var TotalavgTemp;
  var count;
  wb.xlsx.readFile(filePath).then(function(){
  
      var sh = wb.getWorksheet("Sheet1");
      //Get all the rows data [9th and 10th column]
      var tempMin =[];
      var tempMax =[];
      TotalavgTemp = 0;
      count = sh.rowCount;
      for (i = 2; i <= sh.rowCount; i++) {
          tempMax = tempMax.concat(sh.getRow(i).getCell(10).value);
          tempMin = tempMin.concat(sh.getRow(i).getCell(9).value);
          
          TotalavgTemp = TotalavgTemp + ((sh.getRow(i).getCell(9).value+sh.getRow(i).getCell(10).value)/2)
      }
   
  avgTemp = String(Math.round(TotalavgTemp/(count-1),2));
  

  var city2 = 'Sfax';
  var country2 = 'Tunisia';
   
 storeAvgTemperature(city2, country2, avgTemp);
});
// Store location, temperature and time of the observation
function storeAvgTemperature(locs, nats, avgTemps) {
    console.log(avgTemps);
    const dotenv =require('dotenv').config()
    var Mongoose = require('mongoose').Mongoose;
    const bodyParser = require('body-parser');
    const express = require('express');
    const index = express();
index.use(bodyParser.json());
   
    var instace2 = new Mongoose();
    instace2.connect(process.env.DB_conn2, 
        { useNewUrlParser: true },
        () =>console.log('connected to database')
        );
    // define the db schema
    var schema = instace2.Schema({ 
        Place: String,   
        Country: String,
        TempAvg: String,
    });
    var Temperature2 = instace2.model('AvTemp', schema);
   // Create a new object with the fields initialized by the read data
   var t2 = new Temperature2({
      Place: locs, 
      Country: nats,
      TempAvg: avgTemps,  
   })
   // attempt to save the data
   t2.save(function(err) {
     if (err) {
        console.log({message:err}); 
        console.log("error saving"); 
     } else {
        console.log("saved to database"); 
     }
    });   
 };
  

 

