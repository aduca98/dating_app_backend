const clientTokenSecret = "secret"; // same as in other file...
const expiresIn = "7d";
const jwt = require('jsonwebtoken');
const ALGORITHM = 'HS256';
import Exception from './Exception';
import * as ModelTypes from '../models/interfaces';

export default function createClientToken(user : ModelTypes.IUser) {

  return new Promise((resolve, reject) => {

    const payload = {
        userID: user._id,
    }
    
    jwt.sign(payload, clientTokenSecret, {algorithm: ALGORITHM, expiresIn: expiresIn}, (err, token) => {
      if (err) return reject(new Exception("json_web_token_err", "Error signing JSON web token."));
      if (!token) return reject(new Exception("no_token", "Failed to create token"));
      return resolve(token);
    })
  })
}
