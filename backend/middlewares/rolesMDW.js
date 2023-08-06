module.exports = rolesArr => {
    return (req, res, next) => {
        try {
            const { roles } = req.user;

            let hasRole = false;

            roles.forEach(role => {
                if (rolesArr.includes(role)) {
                    hasRole = true;
                }
            });

            if (!hasRole) {
                res.status(403);

                throw new Error('Forbidden');
            }

            next();
        } catch (error) {
            res.status(403);
            res.json({ code: 403, message: error.message });
        }
    };
};
