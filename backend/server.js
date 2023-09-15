const express = require('express');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const LocalAdmin = require('./models/LocalAdmin');
const ws = require('ws');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Express Middleware
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Database Connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error in Connecting", err);
    }
}

connectDB();

// Routes
app.get('/', (req, res) => {
    res.send("OK");
});

app.post('/registerLocalAdmin', async (req, res) => {
    try {
        const { username, password, city, number } = req.body;
        const foundUser = await LocalAdmin.findOne({ username });
        if (foundUser) {
            return res.status(409).json({ message: "Local Admin Already exists" }); // 409 Conflict
        }

        const adminDoc = await LocalAdmin.create({
            username,
            password,
            city,
            contact: number
        });

        console.log(adminDoc);
        res.status(201).json({
            message: "Local Admin registered",
            data: {
                id: adminDoc._id,
                username,
                city,
                number: adminDoc.contact
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create Local Admin' }); // 500 Internal Server Error
    }
});

app.post('/loginLocalAdmin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await LocalAdmin.findOne({ username });
        if (!foundUser) {
            return res.status(404).json({ error: "Local Admin Not found" }); // 404 Not Found
        }

        if (foundUser.password === password) {
            res.status(200).json({ // 200 OK
                message: "Local Admin Logged In",
                data: {
                    id: foundUser._id,
                    username,
                    city: foundUser.city,
                }
            });
        } else {
            res.status(401).json({ error: 'Wrong password' }); // 401 Unauthorized
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to Login Local Admin' }); // 500 Internal Server Error
    }
});

app.get('/allLocalAdmins', async (req, res) => {
    try {
        const localAdmins = await LocalAdmin.find({});
        res.status(200).json({ data: localAdmins }); // 200 OK
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get all Local Admins' }); // 500 Internal Server Error
    }
});

app.delete('/admin/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAdmin = await LocalAdmin.deleteOne({ _id: id });
        if (deletedAdmin.deletedCount === 0) {
            return res.status(404).json({ error: 'Local Admin Not Found' }); // 404 Not Found
        }
        res.status(200).json("OK"); // 200 OK
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete Local Admin' }); // 500 Internal Server Error
    }
});


// WebSocket Handling
const server = app.listen(port, () => {
    console.log("Listening on port", port);
});

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
    console.log('Connected to WebSocket server');

    connection.on('message', (message) => {
        const messageData = JSON.parse(message.toString());

        wss.clients.forEach((client) => {
            client.send(JSON.stringify(messageData));
        });
    });
});
