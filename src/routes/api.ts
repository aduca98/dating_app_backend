import * as express from 'express';
import * as mongoose from 'mongoose';
import * as ModelTypes from '../models/interfaces';

import uploadToGoogle from '../utils/upload';

// Custom middleware, just adds auth information to res.locals
// NOTE: Does not handle redirect
import tokenAuthentication from '../utils/tokenAuthenticationMiddleware';

var USER_ID = "59ebe30f018e36cef0fec8a0";
const User = mongoose.model('User');

// Different services
import LoginService from './Services/LoginService';
import UserService from './Services/UserService';
import MatchService from './Services/MatchService';

const routes = express.Router();

// Logins
routes.post("/local-login", LoginService.localLogin);

routes.post("/create-user", tokenAuthentication, UserService.createUser);
routes.post("/add-descriptions", tokenAuthentication, UserService.addDescriptions);

routes.put("/update-user", tokenAuthentication, UserService.updateUser);
routes.put("/update-descriptions", tokenAuthentication, UserService.updateDescriptions);

routes.get("/my-info", tokenAuthentication, UserService.getMyInfo);
routes.get("/user-info/:id", tokenAuthentication, UserService.getUserInfo);
routes.get("/find-matches", tokenAuthentication, MatchService.findMatch);
routes.get("/computer-features/:id", UserService.computeFeatures);

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

routes.post("/upload", upload.single('photo'), tokenAuthentication, async (req, res) => {
    console.log(req.file);
    try {
        const url = await uploadToGoogle(req.file.filename);
        console.log("URL: " + url);
        const user : ModelTypes.IUser = await User.findByIdAndUpdate(USER_ID, {pictureUrl: url}, {new: true})
        return res.status(200).send({url});
    } catch(e) {
        console.log(e);
        return res.status(400).send({type: "Unknown error", message: e});
    }
});

export default routes;