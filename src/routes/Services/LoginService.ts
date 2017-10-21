import clientToken from '../../utils/clientToken';
import Exception, { IException } from '../../utils/Exception';
import * as mongoose from 'mongoose';

// Database models
import * as ModelTypes from '../../models/interfaces';
const User = mongoose.model('User');
const Shop = mongoose.model('Shop');

export default class LoginService {

    /**
     * @api {post} /api/local-login Logs a user in, returns jwt
     * @apiName local-login
	 * @apiGroup Auth
	 *
	 * @apiDescription Log into the system using email/password, facebook, google or linkedin.
	 * For facebook, google and linkedin methods, the email in the request must match with the email registered with those providers.
	 *
	 * @apiParam {String} email  Email
	 * @apiParam {String} password  Password for email login.
	 *
	 * @apiSuccess {String} token JSON Web Token to be used in subsequent API calls.
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk1OTM0LCJpYXQiOjE1MDExMTk1NjksImV4cCI6MjE",
	 *     }
	 *
	 * @apiError ValidationError One or more parameters are not valid.
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 400 Bad Request
	 *     {
	 *       "code": "ValidationError",
	 *       "message": "password is required"
	 *     }
	 *
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "code": "Unauthorized",
	 *       "message": "Invalid Username or Password"
	 *     }
	 */
    static async localLogin(req, res) {
        const {
            email,
            password
        } = req.body;
        
        const user : ModelTypes.IUser = await User.findOne({email: email}).exec();
        console.log(user);

        if(!user) {
            return res.status(200).json({ success: false,
                                          message: "Email is not valid." });
        }

        const isMatch : boolean = await user.comparePassword(password);
        console.log(isMatch);

        if(isMatch) {
            try {
                const jwt = await clientToken(user);
                return res.status(200).json({ success: true,
                                              jwt: jwt });
            } catch(e) {
                var err : IException = e;
                return res.status(200).json({ success: false,
                                              message: err.message });
            }
        } else {
            return res.status(200).json({ success: false,
                                          message: "Invalid password." });
        }
    }

    /**
     * @api {post} /api/reset-password Creates reset token and emails user
     * @apiName local-login
     * @apiDescription Reset password
	 *
     */
    static async resetPassword(req, res) {

    }

    
}