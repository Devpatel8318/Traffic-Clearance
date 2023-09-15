const express = require('express');
const app = express();
const port = 4000;
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const LocalAdmin = require('./models/LocalAdmin');
const cors = require('cors');

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error in Connecting", err);
    }
}

connectDB();

app.get('/',(req,res)=>{
res.send("ok");
});

app.post('/registerAdmin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await Admin.findOne({ username });
        if (foundUser) {
            res.status(400).json({ message: "Admin Already exist" });
        } else {
            const AdminDoc = await Admin.create({
                username,
                password,
            });
            res.status(201).json({
                message: "Admin registered",
                data: {
                    id: AdminDoc._id,
                    username,
                }
            })
        }
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to create Admin' });
    }
})

app.post('/registerLocalAdmin', async (req, res) => {
    try {
        console.log(req.body);
        const { username, password, city, number } = req.body;
        const foundUser = await LocalAdmin.findOne({ username });
        if (foundUser) {
            res.status(400).json({ message: "Local Admin Already exist" });
        } else {
            const AdminDoc = await LocalAdmin.create({
                username,
                password,
                city,
                contact: number
            });
            console.log(AdminDoc);
            res.status(201).json({
                message: "Local Admin registered",
                data: {
                    id: AdminDoc._id,
                    username,
                    city,
                    number: AdminDoc.contact
                }
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Failed to create Local Admin' });
    }
})

app.post('/loginAdmin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await Admin.findOne({ username });
        if (!foundUser) {
            return res.json({ error: "Admin Not found" });
        }
        else {
            if (foundUser.password == password) {
                res.status(201).json({
                    message: "Admin Logged In",
                    data: {
                        id: foundUser._id,
                        username,
                    }
                })
            } else {
                res.status(400).json({ error: 'Wrong password' });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Failed to Login Admin' });
    }
})

app.post('/loginLocalAdmin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await LocalAdmin.findOne({ username });
        if (!foundUser) {
            return res.json({ error: "Local Admin Not found" });
        }
        else {
            if (foundUser.password == password) {
                res.status(201).json({
                    message: "Local Admin Logged In",
                    data: {
                        id: foundUser._id,
                        username,
                        city: foundUser.city,
                    }
                })
            } else {
                res.status(400).json({ error: 'Wrong password' });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Failed to Login Local Admin' });
    }
})

app.get('/allLocalAdmins', async (req, res) => {
    try {
        const localAdmins = await LocalAdmin.find({});
        res.status(201).json({
            data: localAdmins
        });
    } catch {
        res.status(400).json({ error: 'Failed to get all Local Admins' });
    }
});
app.delete('/admin/:id', async (req, res) => {
    const { id } = req.params; 
    await LocalAdmin.deleteOne({ _id: id });
    res.json("ok");
});


const server = app.listen(port, () => {
    console.log("listening on port ", port);
});
