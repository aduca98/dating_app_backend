import * as mongoose from 'mongoose';
import * as ModelTypes from '../../models/interfaces';
import clientToken from '../../utils/clientToken';

const User = mongoose.model('User');

var errors = {
    11000: "A user with this email already exists."
}

export default class SignupService {

    /**
     * @api {post}
     * @apiRoute: /api/signup
     * @apiDefinition: Creates a user
     * @apiHeader: N/A
     * @apiparams: N/A
     * @apiquery: N/A
     * @apidata: 
     * {
     *      username,
     *      firstName,
     *      lastName,
     *      email,
     *      password
     * }
     * @apiSuccess:
     * {
     *      success: true,
     *      user: {Object},
     *      jwt: {string}
     * }
     * @apiError:
     * {
     *      success: false,
     *      message: {string}   
     * }
     */
    static async signup(req, res) {
        console.log("SIGNING UP...");

        const {
            username,
            firstName,
            lastName,
            email,
            password
        } = req.body;
        
        const u = new User({
            username,
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date(),
            lastInteraction: new Date()
        });

        try {
            await u.save();
            const jwt = await clientToken(u);

            return res.status(200).json({ success: true, 
                                          u: u,
                                          jwt: jwt });
        } catch(e) {
            // Special Exception I created
            if(e.type) {
                return res.status(200).json({ success: false, 
                                              message: e.message || "Unkown error occured" });
            }
            return res.status(200).json({ success: false, 
                                          message: errors[e.code] || "Unkown error occured" });
        }
    }

}