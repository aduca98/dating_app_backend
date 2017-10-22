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
        const potentialMatches : ModelTypes.IUser[] = await User.find({ $and: [ {_id: {$ne: user._id}}, {gender: user.interestedIn} ]});
        console.log(user, potentialMatches);

        fs.writeFile("data.json", JSON.stringify({user, potentialMatches}), 'utf8', async function (err) {
            if (err) {
                console.log(err);
            }
            // PythonShell.run('matcher.py', function (err, results) {
            //     // results is an array consisting of messages collected during execution
            //     console.log('results: %j', results);
            //     return res.status(200).send({ matches: potentialMatches });
            //     // db.getCollection('feed').find({"_id" : {"$in" : [ObjectId("55880c251df42d0466919268"), ObjectId("55bf528e69b70ae79be35006")]}});

            // });
            var matches = [
                ["59ec0f3e018e36cef0ffa5ef", 9.0, ["kids", "cook", "family"]], 
                ["59ec16ca018e36cef0ffcdb0", 8.5, ["kids", "cook"]], 
                ["59ec0ee9018e36cef0ffa380", 8.5, ["kids", "cook"]], 
                ["59ec0fe2018e36cef0ffa921", 4.0, ["Funny", "Arts & Entertainment"]], 
                ["59ec1624018e36cef0ffc98b", 4.0, ["kids", "friends", "cook"]], 
                ["59ec13e8018e36cef0ffbe9b", 3.5, ["kids", "cook", "someone"]], 
                ["59ec1518018e36cef0ffc4b1", 3.0, ["kids", "cook", "dad"]], 
                ["59ec0163018e36cef0ff621c", 1.5, ["Funny", "Arts & Entertainment"]]]
        
            var ids = [];
            for(var i = 0; i < matches.length; i++) {
                var match = matches[i];
                ids.push(match[0]);
            }
            const allMatches = await User.find({"_id": {"$in": ids}});
            return res.status(200).json({ matches: allMatches, metrics: matches });
        }); 

    }

}