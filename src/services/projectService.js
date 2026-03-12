const Project = require('../models/Project');

class ProjectService {
    async getAllProjects(tenantId) {
        return await Project.find({ tenantId });
    }

    async getProjectById(id, tenantId) {
        const project = await Project.findOne({ _id: id, tenantId });
        return project;
    }

    async createProject(projectData) {
        return await Project.create(projectData);
    }

    async updateProject(id, userId, tenantId, role, updateData) {
        const project = await Project.findOne({ _id: id, tenantId });

        if (!project) return { error: 'Project not found', status: 404 };

        if (project.owner.toString() !== userId && role !== 'admin') {
            return { error: 'Not authorized to modify this project', status: 403 };
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        return { data: updatedProject };
    }

    async deleteProject(id, userId, tenantId, role) {
        const project = await Project.findOne({ _id: id, tenantId });

        if (!project) return { error: 'Project not found', status: 404 };

        if (project.owner.toString() !== userId && role !== 'admin') {
            return { error: 'Not authorized to delete this project', status: 403 };
        }

        await project.deleteOne();
        return { success: true };
    }
}

module.exports = new ProjectService();


