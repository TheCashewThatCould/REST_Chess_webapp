const whitelist = require("../config/whiteList");

const credentials = (req, res,next) => {
    const origin = req.headers.origin;
    if(whitelist.includes(origin)){
        res.header('Access-Contol-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials