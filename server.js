const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const conn = mongoose.connection;

conn.once('open', () => {
    console.log("MongoDB Connection established");
});

const deviceSchema = new mongoose.Schema({
    device_name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
});

const Devices = mongoose.model('devices', deviceSchema);

app.get('/getDevices', async(req, res) => {
    try {
        Devices.find()
            .then((devices) => res.json(devices))
            .catch((err) => res.status(400).json("Error: "+err));
    } catch (error) {
        res.status(400).json("There was some error!");
    }
})

app.post('/addDevice', async(req, res) => {
    try {
        const addDevice = new Devices({
            device_name: req.body.device_name
        })

        addDevice.save()
            .then(() => res.json("Device Added!"))
            .catch(err => res.status(400).json("Error: "+err));
        
    } catch (error) {
        res.status(400).json("There was some error!"+error);
    }
})

app.get('/change/:status', async(req, res) => {
    try {
        const stat = req.params.status;

        const device = await Devices.findById(mongoose.Types.ObjectId("6294a52d140b32389682268c"));

        device.status = stat;

        device.save()
            .then(() => res.json("Device Status Changed!"))
            .catch((err) => res.status(400).json("Error: "+err));
        
    } catch (error) {
        res.status(400).json("There was some error!"+error);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});