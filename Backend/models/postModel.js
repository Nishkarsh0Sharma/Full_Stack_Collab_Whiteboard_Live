const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000,
    },
    numberOfLikes: {
        type: Number,
        default: 0,
    },

} , {
    timestamps: true,
    collection: 'test',
});

postSchema.statics.createPost = async function(title , content) {
    try {
        const post = new this({
            title,
            content,
        });
        return post.save();
    } catch (error) {
        throw new Error('Error creating post: ' + error.message);
    }
}

postSchema.statics.getPost = async function(){
    try {
        return this.find();
    } catch (error) {
        throw new Error('Error retrieving post: ' + error.message);
    }
}

const postModel = mongoose.model('Post', postSchema);
module.exports = postModel;