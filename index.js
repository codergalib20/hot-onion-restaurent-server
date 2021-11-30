const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpacy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function run() {
  try {
    await client.connect();
    console.log("database connected successfully");
    const database = client.db("online_foods");
    const foodCollection = database.collection("foods");
    const orderCollection = database.collection("orders");
    //  Get All Foods__
    app.get("/foods", async (req, res) => {
      const cursor = foodCollection.find({});
      const foods = await cursor.toArray();
      res.send(foods);
    });
    // Get Every Single Foods__
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const food = await foodCollection.findOne(query);
      res.json(food);
    });

    // Get All Orders__
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });

    // Order All Orders__
    app.post('/orders', async(req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
      });
   

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Hot Onion server");
});

app.listen(port, () => {
  console.log("Running Hot Onion Server", port);
});
