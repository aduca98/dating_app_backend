import * as mongoose from 'mongoose';
import * as ModelTypes from '../../models/interfaces';
const language = require('@google-cloud/language');
const client = new language.v1beta2.LanguageServiceClient({ keyFilename: 'dateapp-4138fa62cb84.json' });

// Import models
const Match = mongoose.model('Match');
const User = mongoose.model('User');

export default class UserService {

    static async createUser(req, res) {
        const {
            firstName,
            lastName,
            email,
            selfDescription,
            matchDescription
        } = req.body;
        
        var user = new User({
            firstName,
            lastName,
            email,
            matchDescription,
            selfDescription
        });

        // await user.save();

        try {
            const document = {
                content: JSON.stringify(selfDescription),
                type: "PLAIN_TEXT",
                language: "EN"
            };  
            console.log(document);
            
            var text = await client.classifyText({document});
            var sentimentEntities = await client.analyzeEntitySentiment({document});
            var entities = await client.analyzeEntities({document});
            var sentiment = await client.analyzeSentiment({document});

            var results : any = {
                text,
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