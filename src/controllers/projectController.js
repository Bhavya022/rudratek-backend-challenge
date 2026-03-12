const projectService = require('../services/projectService');

exports.getProjects = async (req, res, next) => {
    try {
        const projects = await projectService.getAllProjects(req.user.tenantId);
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        next(err);
    }
};

exports.getProject = async (req, res, next) => {
    try {
        const project = await projectService.getProjectById(req.params.id, req.user.tenantId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

exports.createProject = async (req, res, next) => {
    try {
        req.body.owner = req.user.id;
        req.body.tenantId = req.user.tenantId;
        const project = await projectService.createProject(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;
        const updateData = { title, description, status };

        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const result = await projectService.updateProject(
            req.params.id,
            req.user.id,
            req.user.tenantId,
            req.user.role,
            updateData
        );

        if (result.error) {
            return res.status(result.status).json({ success: false, message: result.error });
        }

        res.status(200).json({ success: true, data: result.data });
    } catch (err) {
        next(err);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const result = await projectService.deleteProject(
            req.params.id,
            req.user.id,
            req.user.tenantId,
            req.user.role
        );

        if (result.error) {
            return res.status(result.status).json({ success: false, message: result.error });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};


