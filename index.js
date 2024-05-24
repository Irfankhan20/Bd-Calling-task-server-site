const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());
app.use(express.json());

//-----------------------------------------------

// MongoDB Connection URI

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@project1.4j1y0pd.mongodb.net/?retryWrites=true&w=majority&appName=project1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productsCollection = client
      .db("bdcalling-task")
      .collection("products");
    const reviewsCollection = client.db("bdcalling-task").collection("reviews");
    const usersCollection = client.db("bdcalling-task").collection("users");

    //all products get
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    //one product get
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    //paginations
    app.get("/pagination", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log("pagi", req.query);
      const result = await productsCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    //all products review get
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    //one product review get
    app.get("/reviews/:id", async (req, res) => {
      const productId = req.params.id;
      try {
        const query = { productId: productId };
        const result = await reviewsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error retrieving reviews", error });
      }
    });

    //post operation of add a food item
    app.post("/addProductReview", async (req, res) => {
      const productReview = req.body;
      const result = await reviewsCollection.insertOne(productReview);
      res.send(result);
    });
    // user saving in db

    app.post("/users", async (req, res) => {
      const doc = req.body;
      console.log("the doc:", doc);
      const query = { email: doc.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "already exist" });
      } else {
        const result = await usersCollection.insertOne(doc);
        res.send(result);
      }
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

//-----------------------------------------------

app.get("/", (req, res) => {
  res.send("custom form application server is running");
});

app.listen(port, () => {
  console.log(`GREEPLANT SHOP server is running on port ${port}`);
});
