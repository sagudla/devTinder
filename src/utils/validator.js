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

const validateEditProfile = (req) => {
    const ALLOWED_FIELDS = ["skills", "about", "gender", "age", "photoUrl"];
    const isUpdateAllowed = Object.keys(req.body).every((field) => ALLOWED_FIELDS.includes(field));
    if (!isUpdateAllowed) {
        throw new Error('Update allowed only for ["skills", "about", "gender", "age"]');
    }
    if (req.body?.skills?.length > 4) {
        throw new Error('Only 4 skills allowed');
    }
}

module.exports = {
    validateSignup,
    validateEditProfile
}