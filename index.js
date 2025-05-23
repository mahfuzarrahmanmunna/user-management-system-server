const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config()



// pass : CqRTJVPJ7xUQGgck
// user : user_management_crud
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hzu9wpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // User Collection
      const usersCollections = client.db('usersDB').collection("users_management")
      
      // users get method for
      app.get('/users', async (req, res) => {
          const cursor = usersCollections.find()
          const result = await cursor.toArray();
          res.send(result)
      })

      //   user post method
      app.post('/users', async(req, res) => {
          const newUser = req.body;
          const result = await usersCollections.insertOne(newUser)
          res.send(result)
          console.log(newUser);
      })

      //   get the each users
      app.get('/users/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await usersCollections.findOne(query);
          res.send(result)
      })

      //   Usr Update method 
      app.put('/users/:id', async (req, res) => {
          const id = req.params.id;
          console.log(id);
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updatedUser = req.body
          const updateDoc = {
              $set: updatedUser
          };
          const result = await usersCollections.updateOne(filter, updateDoc, options);
          res.send(result)
      })

      //   delete method
      app.delete('/users/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await usersCollections.deleteOne(query);
          res.send(result)
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// app create home
app.get('/', (req, res) => {
    res.send("User management Server is getting running")
})

app.listen(port, () => {
    console.log(`User management server is running port ${port}`);
})