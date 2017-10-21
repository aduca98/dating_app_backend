import {model, Schema} from 'mongoose';
import bcrypt = require('bcrypt-nodejs');

const matchSchema : Schema = new Schema({
    firstName: { type: String},
    lastName: { type: String },
    email: { type: String, unique: true },
    selfDescription: { type: String },
    matchDescription: { type: String },
    matchKeywords: { type: Array },
	selfKeywords: { type: Array },
	createdAt: { type: Date }
});

export default model('Match', matchSchema);