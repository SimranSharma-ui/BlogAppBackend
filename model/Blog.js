const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true 
    },
    Description: {
        type: String,
        required: true 
    },
    Image: {
        type: String,
        required: false  
    },
    liked: {
        type: Boolean,
        required: true 
    }
}, {
    timestamps: { createdAt: 'created_on', updatedAt: 'modified_on' } 
});

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
