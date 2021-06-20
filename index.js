//Declaring Dependency Variables.......
const express = require('express')
const cors = require ('cors')
const bodyParser = require('body-parser')
const app = express()
const PORT = 5000
app.use(bodyParser.urlencoded({ extended: false }))
const ObjectId = require('mongodb').ObjectId;
app.use(express.json())
app.use(cors())
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkyg0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const products = client.db(process.env.DB_NAME).collection("products");
  
  console.log('DB COnnected');

  //adding services to database.....
  app.post("/addProducts", (req, res) => {
      const newProduct = req.body;
      products.insertOne(newProduct)
      .then(result => {
          console.log('inserted count', result.insertedCount);
          res.send(result.insertedCount>0)
      })
      console.log(newProduct);
  })



  //all get requests.....
  //all services
  app.get('/allProducts', (req, res) => {
    products.find()
    .toArray((err, pd) =>{
      res.send(pd)
    })
  })

  app.get('/productsTag', (req, res) => {
    products.find({tags:req.query.tags})
    .toArray((err, pd) =>{
      res.send(pd)
    })
  })

 


});


app.get('/', (req, res) => {
    res.send('Welcome to TechNetic Database');
})


app.listen(process.env.PORT || PORT, console.log('listening to port 5000'));