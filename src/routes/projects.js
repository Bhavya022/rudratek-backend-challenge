const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { projectValidation, validate } = require('../middleware/validator');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getProjects)
    .post(projectValidation, validate, createProject);

router
    .route('/:id')
    .get(getProject)
    .put(projectValidation, validate, updateProject)
    .delete(deleteProject);

module.exports = router;

