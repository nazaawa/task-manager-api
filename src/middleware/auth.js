const jwt = require("jsonwebtoken")

const User = require("../model/users");

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace("Bearer ", "");
        const decoded = jwt.verify(token, "this is my key token")
        const user = await User.findOne({ "_id": decoded._id, 'tokens.token': token })
        console.log(token);
        if (!user) {
            throw new Error;
        }
        console.log(user)
        req.token = token;
        req.user = user;
        next()

    } catch (err) {
       // console.log(err)
        res.status(401).send({ error: "Please authentication" })
    }
}

module.exports = auth;