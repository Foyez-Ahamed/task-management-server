const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000
require('dotenv').config()

// middleware //
app.use(cors())
app.use(express.json())



// mongodb //

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wslenxe.mongodb.net/?retryWrites=true&w=majority`;

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


    // operations //

    const taskCollections = client.db('taskManagement').collection('task');


    // CRUD // 
    app.post('/api/createTask', async(req, res) => {
        const taskInfo = req.body
        const result = await taskCollections.insertOne(taskInfo)
        res.send(result);
    })

    app.get('/api/getTask/:email', async(req, res) => {
        const email = req.params.email
        const query = { userEmail : email }
        const result = await taskCollections.find(query).toArray();
        res.send(result)
    })
    // CRUD // 


    // operations //


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb //



app.get('/', (req, res) => {
    res.send('Task management Server is running');
  })
  app.listen(port, () => {
    console.log(`App is running on ${port}`);
  })