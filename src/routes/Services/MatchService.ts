import * as mongoose from 'mongoose';
import { IJwtAuth } from '../../utils/tokenAuthenticationMiddleware';
import * as ModelTypes from '../../models/interfaces';
import fs = require('fs');

const PythonShell = require('python-shell');
const Match = mongoose.model('Match');
const User = mongoose.model('User');

export default class MatchService {

    static async findMatch(req, res) {
        const auth : IJwtAuth = res.locals.jwtAuth;
        console.log(auth);

        if(!auth.isAuthorized) {
            return res.status(403).send("FORBIDDEN");
        }

        const userId = "59ebd30adde82baa62dc11c8";

        const user : ModelTypes.IUser = await User.findById(userId, {_id: 1, matchDescription: 1, matchCategories: 1, interestedIn: 1});
        console.log('u ' + user);
        const potential_matches : ModelTypes.IUser[] = await User.find({gender: user.interestedIn}, {_id: 1, selfDescription: 1, selfCategories: 1});
        console.log(user, potential_matches);

        fs.writeFile("/data.json", {user, potential_matches}, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        }); 

        // PythonShell.run('matcher.py', function (err, results) {
        //     if (err) throw err;
        //     // results is an array consisting of messages collected during execution
        //     console.log('results: %j', results);
        // });

    }

}