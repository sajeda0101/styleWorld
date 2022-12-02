const express = require('express')
const app = express();
require("dotenv").config();
const jwt=require('jsonwebtoken')
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

// jwt token
// function veriFyJWT(req,res,next){
//   const authHeader=req.headers.authorization;
//   if(!authHeader){
//     res.status(401).send({message:'anauthorized access'})
//   }
//   const token=authHeader.split(' ' )[1];
//   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(err,decoded){

//     if(err){
//       res.status(401).send({message:'anauthorized access'})
//     }
//       req.decoded=decoded;
//       next()
//   })
// }


async function run(){
    try{
        const categoryCollection = client.db("style-world").collection("categories");
        const productsCollection = client.db("style-world").collection("products");
        const bookedCollection=client.db('style-world').collection('booking')
        const userCollection=client.db('style-world').collection('users')
        const productAddCollection=client.db('style-world').collection('addProduct')
        
      // Admin verify
      // const verifyAdmin=async (req,res,next)=>{
      //   const decodedEmail=req.decoded.email;
      //   const query={email:decodedEmail}
      //   const user=await userCollection.findOne(query)
      //   if(user?.role !=='admin')
      //   {
      //     return res.status(403).send({message:'forbidden access'})

      //   }
      //   next();
      // }


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
          
          // All api for product add

          // product add api create
          app.post('/addProduct',async(req,res)=>{
            const product=req.body;
            const addProduct=await productAddCollection.insertOne(product);
            res.send(addProduct)
          })
          app.delete('/addProduct/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await productAddCollection.deleteOne(query)
            res.send(result)
          })

          // add product get data
          app.get('/addProduct',async(req,res)=>{
            let query={};
            if(req.query.email){
              query={
                email:req.query.email
              }
            }
             const cursor=productAddCollection.find(query);
             const addProduct=await cursor.toArray();
            res.send(addProduct)
          })

  // All api for booking

    app.get('/booking',async(req,res)=>{
      let query={};
     if(req.query.email){
      query={
        email:req.query.email
      }
     }
     const result=await bookedCollection.find(query).toArray()
     res.send(result)
    })
    
    app.delete('/booking/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)}
      const result=await bookedCollection.deleteOne(query)
      res.send(result)

  })
     // book item create
     app.post('/booking',async(req,res)=>{
      const product=req.body;
      const bookingProduct=await bookedCollection.insertOne(product);
      res.send(bookingProduct)
    })

    // jwt
    // app.post('/jwt',async(req,res)=>{
    //   const email=req.query.email;
    //   const query={email:email}
    //   const user=await userCollection.findOne(query)
    //   if(user){
    //     const token=jwt.sign({email},process.env.ACCESS_TOKEN_KEY,{expiresIn:'7d'})
    //   return  res.send({accessToken:token})

    //   }
    
    //   res.status(403).send({accessToken:'token'})
    // })

    // all api for users
    //user info
    app.post('/users',async(req,res)=>{
      const query=req.body;
      const addUser=await userCollection.insertOne(query);
      res.send(addUser)
    })  
    app.get('/users',async(req,res)=>{
      const query={}
      const users=await  userCollection.find(query).toArray()
      res.send(users)
    })

    // // 
    // app.get('/usersType',async(req,res)=>{
    //  const role=req.query.role;
    //  const query={role};
    //  const result=await userCollection.find(query).toArray();
    //  res.send(result)
    // })

    // admin 
    app.get('/users/admin/:email',async(req,res)=>{
      const email=req.params.email;
      const query={email}
      const user=await userCollection.findOne(query);
      res.send({isAdmin:user?.email.role === 'admin'})
    })
  

    app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)}
      const result=await userCollection.deleteOne(query)
      res.send(result)

  })

    }
    finally{

    }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
    console.log("styleWorld server running ", port);
  });  