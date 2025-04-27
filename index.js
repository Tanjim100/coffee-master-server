const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 6010;


// iToB31kFlNThyTIT


const uri = `mongodb+srv://coffeeMaster:iToB31kFlNThyTIT@cluster0.jfebrce.mongodb.net/?appName=Cluster0`;

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

        const coffeeCollection = client.db("CoffeeDB").collection("Coffee");

        const userCollection = client.db("CoffeeDB").collection("Users");


        app.get('/', (req, res) => {
            console.log('Get/called');
            res.send('this my server simple')
        })

        app.get('/coffee', async (req, res) => {
            console.log('array of coffee');
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);

            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCoffee = req.body;
            const filter = {
                _id: new ObjectId(id),
            };

            const options = {
                upsert: true,
            }

            const coffee = {
                $set: {
                    coffeeName : updatedCoffee.coffeeName,
                    chefName : updatedCoffee.chefName,
                    supplierName : updatedCoffee.supplierName,
                    taste : updatedCoffee.taste,
                    category : updatedCoffee.category,
                    details : updatedCoffee.details,
                    photo : updatedCoffee.photo,
                }
            }

            const result = await coffeeCollection.updateOne(filter, coffee, options);

            res.send(result);
        })

        app.delete('/coffee/:id', async (req, res) => {

            const id = req.params.id;
            console.log(id);
            const query = {
                _id: new ObjectId(id)
            };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);

        })


        // user related APIs

        app.post('/users', async(req, res) => {
            const newUser = req.body;
            console.log('new user to database', newUser);

            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        app.patch('/users', async(req, res) => {
            const email = req.body.email;
            const filter = { email };
            const updateddoc = {
                $set: {
                    lastSignInTime: req.body?.lastLogin,
                }
            }
            const result = await userCollection.updateOne(filter, updateddoc);
            res.send(result);
        })

        app.get('/users', async(req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete(`/users/:id`, async(req, res) =>{
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`my server is running at http://localhost:${port}`);
});



