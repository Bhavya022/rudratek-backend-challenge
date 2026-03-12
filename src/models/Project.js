const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a project title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    status: {
        type: String,
        enum: ['planned', 'in-progress', 'completed', 'on-hold'],
        default: 'planned'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    tenantId: {
        type: String,
        required: true,
        index: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
