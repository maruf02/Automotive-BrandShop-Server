const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ofnl5ln.mongodb.net/?retryWrites=true&w=majority`;

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


        const AllCarBrandCollection = client.db('BrandShopDB').collection('Brands');
        const AllCarCollection = client.db('BrandShopDB').collection('allCars');
        // for all car brands
        app.get('/Brands', async (req, res) => {
            const cursor = AllCarBrandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/Brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AllCarBrandCollection.findOne(query);
            res.send(result);
        })

        app.post('/Brands', async (req, res) => {
            const newBrand = req.body;
            console.log(newBrand);
            const result = await AllCarBrandCollection.insertOne(newBrand);
            res.send(result);
        })

        app.put('/Brands/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updateBrand = req.body;
            const Brand = {
                $set: {
                    BrandName: updateBrand.BrandName,
                    BrandImage: updateBrand.BrandImage
                }
            }

            const result = await AllCarBrandCollection.updateOne(filter, Brand, option);
            res.send(result);
        })

        app.delete('/Brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await AllCarBrandCollection.deleteOne(query);
            res.send(result);
        })


        // for all car brands
        // ************************************
        // for all cars


        app.get('/Cars', async (req, res) => {
            const cursor = AllCarCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/Cars/:brand', async (req, res) => {
            const brand = req.params.brand;
            const cursor = AllCarCollection.find({ brandName: brand });
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);
        });

        app.get('/Cars/:brand/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AllCarCollection.findOne(query);
            // console.log(result);
            res.send(result);
        })

        app.post('/Cars', async (req, res) => {
            const newCar = req.body;
            // console.log(newCar);
            const result = await AllCarCollection.insertOne(newCar);
            res.send(result);
        })

        app.put('/Cars/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updateBrand = req.body;
            const Brand = {
                $set: {
                    image: updateBrand.image,
                    name: updateBrand.name,
                    brandName: updateBrand.brandName,
                    type: updateBrand.type,
                    price: updateBrand.price,
                    rating: updateBrand.rating,
                    description: updateBrand.description
                }
            }

            const result = await AllCarCollection.updateOne(filter, Brand, option);
            console.log(updateBrand);
            res.send(result);
        })
        // for all cars




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('server is running');
});

app.listen(port, () => {
    console.log(`server is running in port${port}`);
})