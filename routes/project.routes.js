const express = require('express');
const router = express.Router();
const projectController = require('../controller/project.controller');
const { isAuth } = require('../middleware/isAuthenticated'); // Make sure path is correct

router.post('/create', isAuth, projectController.createProject); // 🔐 protected
router.get('/', isAuth, projectController.getAllProjects);
router.get('/:id', isAuth, projectController.getProjectById);
router.put('/:projectId/edit-code', isAuth, projectController.editCode);
router.post('/:projectId/add-user', isAuth, projectController.addUserToProject);
router.delete('/:id', isAuth, projectController.deleteProject);

module.exports = router;
