import * as express from 'express';

// Custom middleware, just adds auth information to res.locals
// NOTE: Does not handle redirect
import tokenAuthentication from '../utils/tokenAuthenticationMiddleware';

// Different services
import LoginService from './Services/LoginService';
import SignupService from './Services/SignupService';
import RentalService from './Services/RentalService';
import ShopService from './Services/ShopService';

const routes = express.Router();

// Logins
routes.post("/local-login", LoginService.localLogin);

// Signup
routes.post("/signup", SignupService.signup);

// Rentals
routes.get("/my-rentals", tokenAuthentication, RentalService.seeMyRentals);
routes.get("/rentals/details/:id", tokenAuthentication, RentalService.getRentalDetails);
routes.get("/rentals/rentals-for-item/:id", tokenAuthentication, RentalService.getAllRentalsForItem);
routes.post("/rentals/rent-item/:id", tokenAuthentication, RentalService.rentItem);

// Shops

// works
routes.get("/shops", tokenAuthentication, ShopService.getUsersShops);
// works
routes.get("/shops/:id", tokenAuthentication, ShopService.getShop);
routes.get("/shops/current-rentals/:id", tokenAuthentication, ShopService.getCurrentRentals);
routes.get("/shops/all-rentals/:id", tokenAuthentication, ShopService.getAllRentals);

// works
routes.post("/shops/create", tokenAuthentication, ShopService.createShop);
// works
routes.post("/shops/add-item/:id", tokenAuthentication, ShopService.addItemAndSaveToShop);
// works
routes.get("/shops/item-details/:id", tokenAuthentication, ShopService.getItemDetails);

routes.get("/shops-near-me", tokenAuthentication, ShopService.findLocalShops);
// Tested and good to go
routes.put("/shops/remove-item/:shopID/:itemID", tokenAuthentication, ShopService.removeItemFromShop);

routes.put("/shops/update-info/:id", tokenAuthentication, ShopService.updateShop);
routes.put("/shops/update-location/:id", tokenAuthentication, ShopService.updateShopLocation);

export default routes;