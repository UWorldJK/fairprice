// Import the 'express' library, which is a web server tool-kit for Node.js.
const express = require('express');

// Import the 'body-parser' middleware for parsing incoming request data.
const bodyParser = require("body-parser");

// Create an instance of the Express application.
const app = express();


// Define the port where the server will listen for incoming HTTP requests.
const port = process.env.PORT || 90;

// Serve static files from the 'public' directory. This line configures Express
// to serve static files like HTML, CSS, and JavaScript from this directory.
app.use(express.static('public'));

// Set the view engine to 'ejs'. This line configures Express to use the EJS
// templating engine for rendering views.
app.set('view engine', 'ejs');

// Configure the bodyParser middleware to parse incoming data from forms.
app.use(bodyParser.urlencoded({
    extended: false
}));

const fs = require('fs');
const readline = require('readline');

const filePath = '/Users/jacobkurry/projects/dicktionary/wfp_market_food_prices.csv';

const r1 = readline.createInterface({

  input: fs.createReadStream(filePath),
  crlfDelay: Infinity,
});
let price;
let dict = [];

//read the csv
r1.on('line', (line) => {
  const columns = line.split(',');

  if (columns.length >= 3){

    const country = columns[1];
    const item = columns[7];
    const price = parseFloat(columns[8])
    const currency = columns[9];
    //combine price and currency
    const combinedInfo = `${price} ${currency}`;
    //add to list called dict
    dict.push({
      country: country,
      item: item,
      price: combinedInfo,
    });

  }


});

r1.on('close', () => {
  console.log(dict);
});
dict.push({country: 'turkey', item: 'water', price: '5 lyra'});
dict.push({country: 'india', item: 'water', price: '10 rupees'});
dict.push({country: 'USA', item: 'coffee', price: '3 USD'})
dict.push({country: 'USA', item: 'water', price: '1 USD'})
dict.push({country: 'USA', item: 'milk', price: '5 USD'})
dict.push({country: 'USA', item: 'bread', price: '1.97 USD'})
dict.push({country: 'USA', item: 'eggs', price: '2 USD'})
dict.push({country: 'USA', item: 'gas', price: '3.96 USD'})
dict.push({country: 'USA', item: '1/8 weed', price: '25 USD'})
dict.push({country: 'USA', item: 'za', price: '25 USD'})
dict.push({country: 'USA', item: 'bogies', price: '10 USD'})
dict.push({country: 'turkey', item: 'bogies', price: '105 lyra'})


app.post('/text', (request, response) => {
  //extract item and country from the input field
  const item = request.body.item;
  const country = request.body.country;
  //needs to be exactly the same ===
  let matchingObj = dict.find(o => o.item.toLowerCase() === item.toLowerCase() && o.country.toLowerCase() === country.toLowerCase());


  if (matchingObj){
    //trying to see if matchingobj found a price
    price = matchingObj.price;
  } else {
    price = 'price not found'
  }

  dict.push({item: item, country: country, price: price})


  response.redirect('/');
})


app.get('/', (req, res) => {
  res.render('main.ejs', {price: price})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})