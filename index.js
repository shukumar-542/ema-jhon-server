const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.tncmlce.mongodb.net/?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("eamJhonStore").collection("products");
  const orderCollection = client.db("eamJhonStore").collection("orders");
  app.post('/addProducts', (req,res)=>{
        const  product = req.body
        collection.insertMany(product)
        .then(result =>{
              console.log(result);
        })
  })
      app.get('/', (req,res)=>{
            res.send("Hello duds it's working DB")
      })

      app.get('/products',(req,res)=>{
            collection.find({})
            .toArray((err,document)=>{
                  res.send(document)
            })
      })


      app.get('/product/:key' , (req,res)=>{
            collection.find({key: req.params.key})
            .toArray((err, document)=>{
                  res.send(document[0])
            })
      })
      app.post('/productsByKey',(req,res)=>{
            const productKeys = req.body
            collection.find({key : {$in : productKeys} })
            .toArray((err, document)=>{
                  res.send(document)
            })
      })


      app.post('/addOrder', (req,res)=>{
            const  order = req.body
            orderCollection.insertOne(order)
            .then(result =>{
                  res.send(result.insertedCount > 0)
            })
      })

});


app.listen(process.env.PORT || port)