const validator =  require("validator");
const validateSignup = (req, res, next) => {
    const {firstName, lastName, email, password} = req.body;
    if (!firstName || ! lastName) {
        throw new Error("Name is required");
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is invalid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Not a strong password");
    }
}

module.exports = {
    validateSignup
}