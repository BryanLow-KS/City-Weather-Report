const express = require("express");
const https = require("https"); //native module, no need install
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
  const query = req.body.cityName; //based on the input in the html code
  //req.body is parsed by the bodyparser module, giving us access
  //to post requests from html files
  const apiKey = "2a3de47e569b7580750c9477be7e65a3";
  const unit = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  //structure url according to cityName given by user
  https.get(url, function(response){ //api, external server response
    //https module sends get request to the api formatted url
    //this is a callback function, will be called when sends get req
    console.log(response.statusCode);
    //see if succeed or not, response from api server
    response.on("data", function(data){
      //accessing the data of the whole response
      const weatherData = JSON.parse(data);
      //parse the hexadecimal data into objects
      //weatherdata is the whole data object
      const temp = weatherData.main.temp; //digging in, need to see the object tree
      //to determine where these data are
      const weatherDescription = weatherData.weather[0].description;
      const weatherIcon = weatherData.weather[0].icon;
      //theres a key called icon which corresponds to respective images
      const imageURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      //url for icon(image), changes according to icon key in the data object
      //write need to be strings
      res.write("<p>The weather is currently " + weatherDescription + "<p>");
      res.write("<h1>The temperature in " + req.body.cityName + " is " + temp + " degrees Celsius.</h1>");
      res.write("<img src=" + imageURL + ">");
      //need html img tag to display img
      res.send(); //only one res.send allowed
    })
  });
})
//this server is hosted locally on port 3000, rmb localhost:3000
app.listen(3000, function(){
  console.log("Server is running on port 3000.");
})
