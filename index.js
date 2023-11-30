const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Survey POrt is Running');
})

app.listen(port, () => {
    console.log(`Survey is running on port ${port}`);
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://pollAndSurvey:WA76XmqhU1rOsHrD@cluster0.q0gttvx.mongodb.net/?retryWrites=true&w=majority";

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


        const userCollection = client.db("pollAndSurvey").collection("users");
        const surveyCollection = client.db("pollAndSurvey").collection("surveys");

        // surveys
        app.post('/surveys', async (req, res) => {
            const survey = req.body;
            const result = await surveyCollection.insertOne(survey);
            res.send(result)
            console.log(result)
        })

        app.get('/surveys', async (req, res) => {
            const result = await surveyCollection.find({}).toArray();
            res.send(result)
            console.log(result)
        })

        app.get('/surveys/:id', async (req, res) => {
            const id = req.params.id;
            const result = await surveyCollection.findOne({ _id: new ObjectId(id) });
            res.send(result)
            console.log(result)
        })

        app.delete('/surveys/:id', async (req, res) => {
            const id = req.params.id;
            const result = await surveyCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result)
            console.log(result)
        })
        app.patch('/surveys/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const result = await surveyCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });
            res.send(result);
            console.log(result);
        })
        // surveys end

        // users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: "User already exists", insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
            console.log(result);
        })

        app.get('/users', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
            console.log(users);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        })
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: 'admin',
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
            console.log(result);
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let admin = false;
            if (user) {
                admin = user?.role === 'admin';
            }
            res.send({ admin });
            console.log(admin);
        })
        // users end


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
