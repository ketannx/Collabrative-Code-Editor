const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    usersId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    version: {
        type: String,
        required: true,
    },
    projLanguage: {
        type: String,
        required: true,
        enum: ["python", "java", "javascript", "cpp", "c", "go", "bash"]
    },
    codeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Code'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Project', projectSchema);
