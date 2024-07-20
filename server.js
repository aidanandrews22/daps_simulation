require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const { Readable } = require('stream');
const { GridFSBucket, ObjectId } = require('mongodb');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

console.log('Starting server...');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.log('MongoDB connection error:', err);
        process.exit(1);
    });

const conn = mongoose.connection;
let gfsBucket;

conn.once('open', () => {
    console.log('Connection to MongoDB open');
    gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const imageSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    imageId: { type: ObjectId, required: true },
    tag: { type: String, enum: ['before', 'after'], required: true },
});

const User = mongoose.model('User', userSchema);
const Image = mongoose.model('Image', imageSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.userId = decoded.userId;
        next();
    });
};

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

const uploadToGridFS = (req, res, tag) => {
    if (!req.file) {
        console.error(`No ${tag} image file received`);
        return res.status(400).send(`No ${tag} image file received`);
    }

    const { patientName } = req.body;
    const buffer = req.file.buffer;
    const filename = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);

    const uploadStream = gfsBucket.openUploadStream(filename, {
        contentType: req.file.mimetype,
    });

    const image = new Image({ patientName, imageId: uploadStream.id, tag });

    uploadStream.end(buffer);

    uploadStream.on('finish', async () => {
        try {
            await image.save();
            res.status(200).send(`${tag.charAt(0).toUpperCase() + tag.slice(1)} image uploaded successfully`);
        } catch (error) {
            console.error(`Error saving ${tag} image to database:`, error);
            res.status(500).send(`Error uploading ${tag} image`);
        }
    });

    uploadStream.on('error', (err) => {
        console.error(`Error uploading ${tag} image to GridFS:`, err);
        res.status(500).send(`Error uploading ${tag} image`);
    });
};

app.post('/upload-before', verifyToken, upload.single('before-image'), (req, res) => {
    uploadToGridFS(req, res, 'before');
});

app.post('/upload-after', verifyToken, upload.single('after-image'), (req, res) => {
    uploadToGridFS(req, res, 'after');
});

app.get('/patient-images', verifyToken, async (req, res) => {
    try {
        const images = await Image.find();
        const imageDetails = await Promise.all(images.map(async (image) => {
            const file = await conn.db.collection('uploads.files').findOne({ _id: image.imageId });
            return {
                _id: image._id,
                patientName: image.patientName,
                filename: file.filename,
                tag: image.tag,
                url: `/image/${file.filename}`
            };
        }));
        res.json(imageDetails);
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).send('Error retrieving images');
    }
});

app.get('/image/:filename', async (req, res) => {
    try {
        const file = await conn.db.collection('uploads.files').findOne({ filename: req.params.filename });
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }
        const downloadStream = gfsBucket.openDownloadStreamByName(file.filename);
        downloadStream.pipe(res);
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).send('Error retrieving image');
    }
});

app.get('/:patientName', async (req, res) => {
    try {
        const patientName = req.params.patientName;
        const images = await Image.find({ patientName });

        if (images.length === 0) {
            return res.status(404).send('Patient not found');
        }

        const beforeImage = images.find(image => image.tag === 'before');
        const afterImage = images.find(image => image.tag === 'after');

        if (!beforeImage) {
            return res.status(404).send('Before image not found');
        }

        const beforeFile = await conn.db.collection('uploads.files').findOne({ _id: beforeImage.imageId });
        const afterFile = afterImage ? await conn.db.collection('uploads.files').findOne({ _id: afterImage.imageId }) : null;

        let styles = '';
        let scripts = '';

        try {
            styles = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
        } catch (err) {
            console.error('Error reading styles.css:', err);
        }

        try {
            scripts = fs.readFileSync(path.join(__dirname, 'public', 'script.js'), 'utf8');
        } catch (err) {
            console.error('Error reading script.js:', err);
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Before and After</title>
                <style>
                    ${styles}
                </style>
            </head>
            <body>
                <header>
                    <img id="header" src="/assets/logo.png" alt="Logo">
                </header>
                <div class="centered">
                    <h1>Before and After</h1>
                    <div class="image-container">
                        <img id="before-image" src="/image/${beforeFile.filename}" alt="Before Image">
                        ${afterFile ? `<img id="after-image" src="/image/${afterFile.filename}" alt="After Image">` : ''}
                    </div>
                    <div class="side-by-side-container" style="display: none;">
                        <img id="side-before-image" src="/image/${beforeFile.filename}" alt="Before Image">
                        ${afterFile ? `<img id="side-after-image" src="/image/${afterFile.filename}" alt="After Image">` : ''}
                    </div>
                    <div class="buttons">
                        <button id="save">Save Photo</button>
                        <button id="toggle-button">Toggle Before/After</button>
                        <button id="send">Send Photo To Me</button>
                        <button id="save-pdf">Save as PDF</button>
                    </div>
                    <div class="switch-container">
                        <label class="switch">
                            <input type="checkbox" id="view-switch">
                            <span class="slider round"></span>
                        </label>
                        <span>Side by Side View</span>
                    </div>
                </div>
                <div id="send-popup" class="popup">
                    <div class="popup-content">
                        <span class="close">&times;</span>
                        <p>Enter your email:</p>
                        <input type="text" id="contact-info" placeholder="email">
                        <button id="send-confirm">Send</button>
                    </div>
                </div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
                <script>
                    ${scripts}
                </script>
              <footer>
                <p>© <script>document.write(new Date().getFullYear());</script> Dr. Andrews Plastic Surgery</p>
              </footer>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error retrieving patient images:', error);
        res.status(500).send('Error retrieving patient images');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

