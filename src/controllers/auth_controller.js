const User = require('../models/user_model');

class AuthController{
    static async login(req,res,next) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({username});
            if(user){
                if(user.password == password){
                    return res.status(200).json({
                        name: user.name,
                        permission: user.permission,
                        token: user.token
                    })
                }
            }
            return res.status(401).json({});
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = AuthController