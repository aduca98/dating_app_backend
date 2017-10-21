import * as mongoose from 'mongoose';
import * as ModelTypes from '../../models/interfaces';
import clientToken from '../../utils/clientToken';
import { IJwtAuth } from '../../utils/tokenAuthenticationMiddleware';

const language = require('@google-cloud/language');
const client = new language.v1beta2.LanguageServiceClient({keyFilename: 'dateapp-4138fa62cb84.json'});

// Import models
const Match = mongoose.model('Match');
const User = mongoose.model('User');

function formatCategories(categories) {         
    console.log("C " + JSON.stringify(categories));
    const formattedCategories = {};
    for(let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const name = category.name;
        const confidence = category.confidence;
        
        // Set multiple confidences
        var names;
        try {
            names = name.split("/");
            for(let j = 0; j < names.length; j++) {
                const category = names[i];
                formattedCategories[category] = confidence;
            }
        } catch(e) {
            formattedCategories[name] = confidence;
        }
        
    }
    return formatCategories;
}

function formatEntities(entities) {
    console.log("E " + JSON.stringify(entities));
    const formattedEntities = {};
    for(let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const name = entity.name;
        const salience = entity.salience;
        
        if(name) formattedEntities[name] = salience;
    }
    return formattedEntities;
}

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
            var self_cat = await client.classifyText({document: selfDocument});
            var self_entities = await client.analyzeEntities({document: selfDocument});

            const self_fc = formatCategories(self_cat);
            const self_fe = formatEntities(self_entities);

            var match_cat = await client.classifyText({document: matchDocument});
            var match_entities = await client.analyzeEntities({document: matchDocument});

            const match_fc = formatCategories(match_cat);
            const match_fe = formatEntities(match_entities);

            var results : any = {
                self_fc,
                self_fe,
                match_fc,
                match_fe
            };
            console.log(results);

            const keywordsData = {
                matchCategories: match_cat,
                matchEntitySalience: match_entities,
                selfCategories: self_cat,
                selfEntitySalience: self_entities,
            }

            // const newUser = await User.findById(userId, keywordsData, {new: true});
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