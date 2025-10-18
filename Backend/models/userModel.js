const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name  : {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
} , {
    timestamps: true,
    collection: 'users'
});

userSchema.statics.register = async function (name, email, password) {
    try {
        // check if email is valid
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format');
        }

        // check if password is strong
        // default options: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            throw new Error('Password must be at least 8 chars long and include lowercase, uppercase, number, and symbol');
        }

        // generate salt & hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const user = new this({
            name,
            email, // normalize email
            password: hashedPassword
        });

        await user.save();
        return user;
    } catch (error) {
        throw new Error('Error registering user: ' + error.message);
    }
};

userSchema.statics.getUsers = async function (email) {
    try {
        const users = await this.findOne({ email });
        return users;
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
};

userSchema.statics.login = async function (email, password) {
    try {
        // find user by email
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        return user; // login successful
    } catch (error) {
        throw new Error('Error logging in: ' + error.message);
    }
};

const userModel = mongoose.model('User', userSchema);
module.exports = userModel; 