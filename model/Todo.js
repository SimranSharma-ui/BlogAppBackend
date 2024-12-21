const {  mongoose } = require("mongoose");

const TodoSchema = mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    completedBY: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_on', updatedAt: 'modified_on' } 
});

const Todos = mongoose.model("Todos",TodoSchema);
module.exports = Todos;
