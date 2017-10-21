import * as mongoose from 'mongoose';
import * as ModelTypes from '../../models/interfaces';
import clientToken from '../../utils/clientToken';
import { IJwtAuth } from '../../utils/tokenAuthenticationMiddleware';

const language = require('@google-cloud/language');
const client = new language.v1beta2.LanguageServiceClient({ keyFilename: 'dateapp-4138fa62cb84.json' });

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
            interestedIn
        } = req.body;
        var u : ModelTypes.IUser = new User({
            name,
            fbId,
            fbToken,
            pictureUrl,
            interestedIn
        });
        try {
            await u.save();
            const token = await clientToken(u);
            return res.status(201).json({ user: u, token: token });
        } catch(e) {
            console.log(e);
            // Already a user for this...
            const user : ModelTypes.IUser = await User.find({name: name, fbToken: fbToken});
            if(user) {
                const token = await clientToken(user);
                return res.status(200).send({user, token}); 
            }
            return res.status(400).send({message: 'Failed to save user'}); 
        }
    }

    static async addMatchingData(req, res) {
        const {
            selfDescription,
            matchDescription
        } = req.body;

        const auth : IJwtAuth = res.locals.jwtAuth;
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

            var results : any = {
                categories,
                sentimentEntities,
                entities
            };

            return res.status(200).send({ results: results, user: user })
            
        } catch(e) {
            console.log(e);
            return res.status(400).send({ 
                                            type: "unknown", 
                                            message: "error has occured" 
                                        });
        }
        
    }

    static async getUserInfo(req, res) {
        return res.status(200).send({ success: true });
    }

}