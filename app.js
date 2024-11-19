
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const Vendor = require('./Schema/vendor');
const Resource = require('./Schema/resource');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("MongoDB Connected"))
   .catch(err => console.log("MongoDB Connection Error:", err));


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post('/vendors', async (req, res) => {
  const vendor = new Vendor(req.body);
  await vendor.save();
  res.status(201).send(vendor);
});

app.get('/vendors', async (req, res) => {
  const vendors = await Vendor.find();
  res.send(vendors);
});

app.post('/resources', upload.single('resume'), async (req, res) => {
  const resource = new Resource({
    ...req.body,
    resumePath: req.file.filename,
  });
  await resource.save();
  res.status(201).send(resource);
});

app.get('/resources', async (req, res) => {
  const resources = await Resource.find().populate('vendor');
  res.send(resources);
});


app.listen(5000, () => console.log('Server running on http://localhost:5000'));
