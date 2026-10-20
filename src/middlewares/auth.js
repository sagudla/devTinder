const authMiddleware = (req, res, next) => {
    const token = "xyz111";
    const isAdminAuthenticated = token === "xyz";
    if (isAdminAuthenticated) {
       next();
    } else {
        //res.status(401).send("Unauthorized");
        const error = new Error("Admin is not authorized!");
        error.statusCode = 401;
        throw error;
    }
}

module.exports = {
    authMiddleware
};