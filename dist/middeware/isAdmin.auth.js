import UserModel from '../models/Users.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const checkUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedinfo) => {
            if (err) {
                console.log(err);
                res.locals.user = null;
                next();
            }
            else {
                let user = await UserModel.findById(decodedinfo.id);
                console.log(decodedinfo);
                res.locals.user = user;
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
};
//# sourceMappingURL=isAdmin.auth.js.map