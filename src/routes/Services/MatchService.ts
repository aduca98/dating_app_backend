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

        const userId = "59ebe10cd773b2bd94d7dca4";

        const user : ModelTypes.IUser = await User.findById(userId); 
        console.log('u ' + user);
        const potentialMatches : ModelTypes.IUser[] = await User.find({gender: user.interestedIn});
        console.log(user, potentialMatches);

        fs.writeFile("./data.json", JSON.stringify({user, potentialMatches}), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
            PythonShell.run('matcher.py', function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
                console.log(results[0]);
            });

        }); 

    }

}