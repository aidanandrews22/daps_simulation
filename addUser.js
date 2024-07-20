require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const addUser = async (username, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        console.log('User added successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error adding user:', error);
        mongoose.connection.close();
    }
};

// Replace 'newusername' and 'newpassword' with the desired username and password
addUser('admin', 'abc123');

