const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb'); // import ObjectId

const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
require('dotenv').config()

app.use(cors())
app.use(express.json())



// mongodb+srv://<db_username>:<db_password>@cluster0.i8dfsxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// const uri = mongodb+srv:<db_username>:<db_password>@cluster0.i8dfsxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// HobbyHub
// aUduSGpvdXGMO8CR

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i8dfsxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const hobbyHubCollection = client.db('HobbyHub').collection('Users')
    const hobbyHub_GroupsCollection = client.db('HobbyHub').collection('Groups')


///////// User /////////////////////////
    app.get('/', (req, res) => {
      res.send('Hello World!............ Ayatullah')
    })

    app.post('/register', async(req, res) => {
      const userProfile = req.body
      console.log(userProfile)
      const result = await hobbyHubCollection.insertOne(userProfile)
      console.log(result)
      res.send(result)
    })





    /////////////// Groups ///////////////////
    app.post('/groups', async (req, res) => {
  try {
    const groupData = req.body;

    if (!groupData.creatorEmail) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const result = await hobbyHub_GroupsCollection.insertOne(groupData);
    res.send(result);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error creating group" });
  }
});

    app.get('/allGroups', async(req, res) => {
      const result = await hobbyHub_GroupsCollection.find().toArray()
      res.send(result)

  })

  

app.get('/allGroups/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await hobbyHub_GroupsCollection.findOne(query); // ✅ correct collection

    if (!result) {
      return res.status(404).send({ message: "Group not found" });
    }

    res.send(result); // ✅ JSON
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching group" });
  }
});

  // ✅ Update Group Route
  app.put("/updateGroup/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;

      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          groupName: updatedData.groupName,
          description: updatedData.description,
          category: updatedData.category,
          meetingLocation: updatedData.meetingLocation,
          maxMembers: updatedData.maxMembers,
          startDate: updatedData.startDate,
          imageURL: updatedData.imageURL
        }
      };

      const result = await hobbyHub_GroupsCollection.updateOne(filter, updateDoc);

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Group not found" });
      }

      res.send({ message: "Group updated successfully", result });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Error updating group" });
    }
  });



  // Delete Group
app.delete("/groups/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };

    const result = await hobbyHub_GroupsCollection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Group not found" });
    }

    res.send({ message: "Group deleted successfully ", result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting group" });
  }
});









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
