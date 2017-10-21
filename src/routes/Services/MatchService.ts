import * as mongoose from 'mongoose';
import { IJwtAuth } from '../../utils/tokenAuthenticationMiddleware';

const Match = mongoose.model('Match');
const User = mongoose.model('User');

export default class MatchService {

    static async findMatch(req, res) {
        const auth : IJwtAuth = res.locals.jwtAuth;
        console.log(auth);

        if(!auth.isAuthorized) {
            return res.status(403).send("FORBIDDEN");
        }

        const userId = auth.userID;
        const user = await User.findById(userId);
        console.log(user);

        

    }

}