const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    // In code schema
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true    // Isiliye null allow nahi
    },
    projLanguage: {
        type: String,
        required: true,
        enum: ["python", "java", "javascript", "cpp", "c", "go", "bash"]
    },
    version: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    codeUpdate: {
        type: [String],
        required: true
    },
    language: {
        type: String,
        required: true
    },
    usersId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Code', codeSchema);
