const express = require('express')
const app = express();
require("dotenv").config();
const cors=require('cors')
const { MongoClient, ServerApiVersion,ObjectId} = require('mongodb');

const port = process.env.PORT || 5000;




// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('styleworld')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dbebnio.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const categoryCollection = client.db("style-world").collection("categories");
        const productsCollection = client.db("style-world").collection("products");
        const bookedCollection=client.db('style-world').collection('bookedProduct')
        // second hand category
        app.get("/category", async (req, res) => {
            let query = {}
            const cursor = categoryCollection.find(query);
            const category = await cursor.toArray();
            res.send(category);
            
          })

          // single product get by category
          app.get('/products',async(req,res)=>{
            const category_id=req.query.category_id;
            let query={category_id}
              const cursor=productsCollection.find(query);
              const products=await cursor.toArray();
              res.send(products)
          })
          
          // book item create
          app.post('/booked',async(req,res)=>{
            const product=req.body;
            const bookingProduct=await bookedCollection.insertOne(product);
            res.send(bookingProduct)
          })
          
          // product add
          app.post('/addProduct',async(req,res)=>{
            const product=req.body;
            const addProduct=await productsCollection.insertOne(product);
            res.send(addProduct)
          })

    }
    finally{

    }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
    console.log("styleWorld server running ", port);
  });  