import * as mongoose from 'mongoose';
import { IJwtAuth } from '../../utils/tokenAuthenticationMiddleware';
import * as ModelTypes from '../../models/interfaces';
import fs = require('fs');

const PythonShell = require('python-shell');
const Match = mongoose.model('Match');
const User = mongoose.model('User');

var USER_ID = "59ebe30f018e36cef0fec8a0";

export default class MatchService {

    static async findMatch(req, res) {
        // const auth : IJwtAuth = res.locals.jwtAuth;
        // console.log(auth);

        // if(!auth.isAuthorized) {
        //     return res.status(403).send("FORBIDDEN");
        // }

        const userId = USER_ID;

        const user : ModelTypes.IUser = await User.findById(userId); 
        console.log('u ' + user);
        const potentialMatches : ModelTypes.IUser[] = await User.find({ _id: {$ne: user._id}});
        console.log(user, potentialMatches);

        fs.writeFile("data.json", JSON.stringify({user, potentialMatches}), 'utf8', function (err) {
            if (err) {
                console.log(err);
            }
            PythonShell.run('matcher.py', function (err, results) {
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
                return res.status(200).send({ matches: potentialMatches });
                // db.getCollection('feed').find({"_id" : {"$in" : [ObjectId("55880c251df42d0466919268"), ObjectId("55bf528e69b70ae79be35006")]}});

            });
        }); 

    }

}