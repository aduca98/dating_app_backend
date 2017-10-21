import * as mongoose from 'mongoose';
import * as ModelTypes from '../../models/interfaces';
import clientToken from '../../utils/clientToken';
import { IJwtAuth } from '../../utils/tokenAuthenticationMiddleware';

const language = require('@google-cloud/language');
const client = new language.v1beta2.LanguageServiceClient();

// Import models
const Match = mongoose.model('Match');
const User = mongoose.model('User');

export default class UserService {

    static async createUser(req, res) {
        const {
            name,
            fbId,
            fbToken,
            pictureUrl,
            interestedIn,
            gender
        } = req.body;
        
        console.log(req.body);
        var u : ModelTypes.IUser = new User({
            name,
            fbId,
            fbToken,
            pictureUrl,
            interestedIn,
            gender
        });
        try {
            await u.save();
            console.log("SAVED USER " + u);
            const token = await clientToken(u);
            return res.status(201).json({ user: u, token: token });
        } catch(e) {
            console.log(e);
            // Already a user for this...
            const user : ModelTypes.IUser = await User.findOne({fbToken: fbToken});
            console.log("found user " + user);
            if(user) {
                const token = await clientToken(user);
                console.log(user, token);
                return res.status(200).send({user, token}); 
            }
            return res.status(400).send({message: 'Failed to save user'}); 
        }
    }

    static async addDescriptions(req, res) {
        const {
            selfDescription,
            matchDescription
        } = req.body;
        console.log(req.body);

        const auth : IJwtAuth = res.locals.jwtAuth;
        console.log(auth);

        if(!auth.isAuthorized) {
            return res.status(403).send("FORBIDDEN");
        }

        const userId = auth.userID;
        const data = { selfDescription, matchDescription };
        
        const user : ModelTypes.IUser = await User.findByIdAndUpdate(userId, data).exec();

        try {
            const selfDocument = {
                content: JSON.stringify(selfDescription),
                type: "PLAIN_TEXT",
                language: "EN"
            };  
            const matchDocument = {
                content: JSON.stringify(matchDescription),
                type: "PLAIN_TEXT",
                language: "EN"
            }
            var categories = await client.classifyText({document: selfDocument});
            var sentimentEntities = await client.analyzeEntitySentiment({document: selfDocument});
            var entities = await client.analyzeEntities({document: selfDocument});
            var sentiment = await client.analyzeSentiment({document: selfDocument});

            // Format categories 
            const formattedCategories = {};
            for(let i = 0; i < categories; i++) {
                const category = categories[i];
                const names = category.name.split("/");
                const confidence = category.confidence;
                for(let j = 0; j < names.length; j++) {
                    const category = names[i];
                    formattedCategories[category] = confidence;
                }
            }

            var results : any = {
                categories,
                sentimentEntities,
                entities
            };

            

            const newUser = await User.findById(userId, data {new: true});
            return res.status(200).send({ results: results, user: user })
            
        } catch(e) {
            console.log(e);
            return res.status(400).send({ 
                                            type: "unknown", 
                                            message: "error has occured" 
                                        });
        }
        
    }

    static async getMyInfo(req, res) {
        const auth : IJwtAuth = res.locals.jwtAuth;
        const fbId = req.query.fbId;
        const userId = auth.userID;

        var query;
        if(fbId) {
            query = {fbId: fbId};
        } else {
            query = {_id: userId};
        }
                
        const user = await User.findOne(query);
        return res.status(200).send({ user: user });
    }

    static async getUserInfo(req, res) {
        const auth : IJwtAuth = res.locals.jwtAuth;
        if(!auth.isAuthorized) {
            return res.status(403).send("FORBIDDEN");
        }
        const userId = req.params.id;
        const user = await User.findById(userId);
        return res.status(200).send({ user: user });
    }

}