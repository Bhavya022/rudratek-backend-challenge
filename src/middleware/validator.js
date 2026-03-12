const { validationResult, check } = require('express-validator');

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

exports.registerValidation = [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('tenantId', 'Tenant/Company ID is required').not().isEmpty().trim().escape()
];

exports.loginValidation = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
];

exports.projectValidation = [
    check('title', 'Title is required').not().isEmpty().trim().escape().isLength({ max: 100 }),
    check('description', 'Description is required').not().isEmpty().trim().escape(),
    check('status', 'Invalid status').optional().isIn(['planned', 'in-progress', 'completed', 'on-hold'])
];

