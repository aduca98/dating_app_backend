import * as express from 'express';

// Custom middleware, just adds auth information to res.locals
// NOTE: Does not handle redirect
import tokenAuthentication from '../utils/tokenAuthenticationMiddleware';

// Different services
import LoginService from './Services/LoginService';
import UserService from './Services/UserService';
import MatchService from './Services/MatchService';

const routes = express.Router();

// Logins
routes.post("/local-login", LoginService.localLogin);

routes.post("/create-user", tokenAuthentication, UserService.createUser);
routes.post("/add-descriptions", tokenAuthentication, UserService.addDescriptions);
routes.get("/my-info", tokenAuthentication, UserService.getMyInfo);
routes.get("/user-info/:id", tokenAuthentication, UserService.getUserInfo);

export default routes;