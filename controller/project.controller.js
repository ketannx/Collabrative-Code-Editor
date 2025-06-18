const Project = require('../models/project.schema');
const Code = require('../models/code.schema');

// Startup Code Generator
function getStartupCode(language) {
    if (typeof language !== "string") {
        return 'Invalid language input';
    }

    const lang = language.toLowerCase();

    const codes = {
        python: 'print("Hello World")',
        java: 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }',
        javascript: 'console.log("Hello World");',
        cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}',
        c: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}',
        go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}',
        bash: 'echo "Hello World"'
    };

    return codes[lang] || 'Language not supported';
}

// ✅ Create a new project (only for logged-in users)
exports.createProject = async (req, res) => {
    try {
        const { name, description, projLanguage, version } = req.body;
        const adminId = req.user.id;
        const usersId = [adminId];

        // Step 1: Create project without codeId
        const project = await Project.create({
            name,
            description,
            usersId,
            adminId,
            version,
            projLanguage,
            codeId: null,
        });

        // Step 2: Generate starter code
        const startupCode = getStartupCode(projLanguage);

        // Step 3: Create code document
        const code = await Code.create({
            projectId: project._id,
            projLanguage,
            version,
            code: startupCode,
            codeUpdate: [startupCode],
            language: projLanguage,
            usersId,
        });

        // Step 4: Link codeId to project
        project.codeId = code._id;
        await project.save();

        res.status(201).json({ message: "Project created", project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all projects for a user
exports.getAllProjects = async (req, res) => {
    try {
        const userId = req.user.id;

        const projects = await Project.find({ usersId: userId })
            .populate('codeId')
            .populate('usersId')
            .populate('adminId');

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get specific project by ID (only if user is in project)
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const project = await Project.findOne({ _id: id, usersId: userId })
            .populate('codeId')
            .populate('usersId')
            .populate('adminId');

        if (!project) return res.status(404).json({ message: "Project not found or access denied" });

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Edit code (collaborators & admin)
exports.editCode = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { newCode } = req.body;
        const userId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project || !project.usersId.includes(userId)) {
            return res.status(403).json({ message: "Not allowed to edit this project's code" });
        }

        const code = await Code.findById(project.codeId);
        code.code = newCode;
        code.codeUpdate.push(newCode);
        await code.save();

        res.status(200).json({ message: "Code updated", code });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete project (admin only)
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.adminId.toString() !== userId) {
            return res.status(403).json({ message: "Only admin can delete the project" });
        }

        await Code.findByIdAndDelete(project.codeId);
        await Project.findByIdAndDelete(id);

        res.status(200).json({ message: "Project and its code deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Add user to project (only admin)
exports.addUserToProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { newUserId } = req.body;
        const requesterId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.adminId.toString() !== requesterId) {
            return res.status(403).json({ message: "Only admin can add users" });
        }

        if (project.usersId.includes(newUserId)) {
            return res.status(400).json({ message: "User already part of the project" });
        }

        project.usersId.push(newUserId);
        await project.save();

        // Also add to Code's usersId
        const code = await Code.findById(project.codeId);
        if (!code.usersId.includes(newUserId)) {
            code.usersId.push(newUserId);
            await code.save();
        }

        res.status(200).json({ message: "User added to project", project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
