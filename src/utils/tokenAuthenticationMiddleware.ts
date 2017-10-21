import jsonwebtoken = require('jsonwebtoken')

const clientTokenSecret = "secret";
const jwtBearerPattern = "[a-zA-Z0-9-_]+?.[a-zA-Z0-9-_]+?.([a-zA-Z0-9-_]+)[/a-zA-Z0-9-_]+?$"; 
//new RegExp(/^bearer <?([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)>?$/, 'i')

export interface IJwtAuth {
  message: string,
  isAuthorized: boolean,
  accessToken: string | null,
  decodedToken: string | null,
  userID: string | null
}

export default function tokenAuthentication(req, res, next) {
  res.locals.jwtAuth = {message: '', isAuthorized: false, accessToken: null, decodedToken: null, userID: null }

  const auth = req.get('authorization')
  // console.log("Authorization " + auth);

  if (!auth) {
    res.locals.jwtAuth.message = 'There is no Authorization header.'
    return next();
  }
  const atMatch = auth.split("bearer: ");
  console.log(atMatch)
  // const atMatch = auth.match(jwtBearerPattern);
  const accessToken = Array.isArray(atMatch) && atMatch[1] ? atMatch[1] : null;
  
  if (!accessToken) {
    res.locals.jwtAuth.message = 'A valid bearer token was not found in the Authorization header.'
    return next();
  }
  
  res.locals.jwtAuth.accessToken = accessToken
  
  jsonwebtoken.verify(accessToken, clientTokenSecret, (err, decodedToken) => {
    if (err) {
      console.log(err);
      res.locals.jwtAuth.message = err.message || 'An unknown error occurred verifying the JWT.'
      return next()
    }
    console.log(decodedToken);
    
    res.locals.jwtAuth.decodedToken = decodedToken
    res.locals.jwtAuth.userID = decodedToken.userID || null
    
    if (!res.locals.jwtAuth.userID) {
      res.locals.jwtAuth.message = 'The token did not contain a usrId.'
      return next();
    }
    
    res.locals.jwtAuth.isAuthorized = true
    return next();
  })
}
