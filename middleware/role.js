function checkRole(roles) {
    return (req, res, next) => {

        const role = req.headers.role;

        if (!roles.includes(role)) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
}

module.exports = checkRole;