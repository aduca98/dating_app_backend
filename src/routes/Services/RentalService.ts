import * as mongoose from 'mongoose';
import * as ModelTypes from '../../models/interfaces';
import { IJwtAuth } from '../../utils/tokenAuthenticationMiddleware';
import Exception, { IException } from '../../utils/Exception';

const User = mongoose.model('User');
const Shop = mongoose.model('Shop');
const Rental = mongoose.model('Rental');
const Item = mongoose.model('Item');

var ObjectID = require("mongodb").ObjectID;

export default class RentalService {

     /**
     * @api {get}
     * @apiAuth: Needs authentication
     * @apiRoute: /api/rentals
     * @apiDefinition: Gets local rentals
     * @apiparams: N/A
     * @apiquery: N/A
     * @apidata: 
     * {
     *      success: true,
     *      user: userdata
     *      jwt: ""
     * }
     */
    static async seeMyRentals(req, res) {
        const auth : IJwtAuth = res.locals.jwtAuth;
        if(!auth.isAuthorized) {
            console.log(auth.message);
            return res.status(403).json({ success: false, 
                                          message: auth.message });
        }
        const userID = auth.userID;

        try {
            const rentals = await Rental.find({user: userID}).sort({createdAt: -1}).exec();
            return res.status(200).json({ success: true, 
                                          rentals: rentals });
        } catch(e) {
            console.log(e);
            return res.status(404).json({ success: false,
                                          message: "Failed to find rentals." });
        }

    }

    /**
     * @api {get}
     * @apiAuth: Needs authentication
     * @apiRoute: /api/rentals/shop/:id
     * @apiDefinition: Gets local rentals
     * @apiparams: 
     *      id: string => shop id
     * @apiquery:
     *      scope: string => current, expired, or all NOT IMPLEMENTED
     * @apidata: 
     * {
     *      success: true,
     *      rentals: rentals
     * }
     */
    static async getAllRentalsForShop(req, res) {
        const auth : IJwtAuth = res.locals.jwtAuth;
        if(!auth.isAuthorized) {
            console.log(auth.message);
            return res.status(403).json({ success: false, 
                                          message: auth.message });
        }
        const shopID = req.params.id;
        var r : ModelTypes.IRental;
        try {
            const rentals = await Rental.find({shop: shopID}).exec();
        } catch(e) {
            console.log(e);
            return res.status(400).json({ success: false, 
                                          message: "Database error." });
        }

    }

    /**
     * @api {get}
     * @apiAuth: Needs authentication
     * @apiRoute: /api/rentals/item/:id
     * @apiDefinition: Gets all of rentals for a given item
     * @apiparams: 
     *      id: string => item id
     * @apidata: N/A
     * @apiSuccess: 
     * {
     *      success: true
     *      rentals: {Array<IRental>}
     * }
     * @apiFailure:
     * {
     *      success: false,
     *      message: {string}
     * }
     */
    static async getAllRentalsForItem(req, res) {
        const auth : IJwtAuth = res.locals.jwtAuth;
        if(!auth.isAuthorized) {
            console.log(auth.message);
            return res.status(403).json({ success: false, 
                                          message: auth.message });
        }
        const itemID = req.params.id;

        try {
            const rentals = await Rental.find({item: itemID}).exec();
            return res.status(200).json({ success: true,
                                          rentals: rentals });
        } catch(e) {
            console.log(e);
            return res.status(400).json({ success: false, 
                                          message: "Database error." });
        }

    }

    /**
     * @api {get}
     * @apiAuth: Not protected at all
     * @apiRoute: /api/rentals/details/:id
     * @apiDefinition: Returns a rental object 
     * @apiparams: N/A
     * @apiquery: N/A
     * @apidata: 
     * {
     *      success: true,
     *      user: userdata
     *      jwt: ""
     * }
     */
    static async getRentalDetails(req, res) {
        const rentalID = req.params.id;
        try {
            const rental = Rental.findById(rentalID).exec();
            return res.status(200).json({ success: true,
                                          rental: rental });
        } catch(e) {
            console.log(e);
            return res.status(400).json({ success: false, 
                                          message: "Unknown db error has occured."});
        }
    }

    /**
     * @api {post} /api/rentals/rent-item/:id Rent an item
     * 
     * @apiDefinition: Returns a rental object. When does payment happen. Idk...
     * 
     * @apiParam {String}
     * @apiquery: N/A
     * @apidata: 
     * {
     *      success: true,
     *      user: userdata
     *      jwt: ""
     * }
     */
    static async rentItem(req, res) {
        const auth : IJwtAuth = res.locals.jwtAuth;
        if(!auth.isAuthorized) {
            console.log(auth.message);
            return res.status(403).json({ success: false, 
                                          message: auth.message });
        }
        const itemID = req.params.id;
        try {
            const item : ModelTypes.IItem = await Item.findById(itemID).populate("shop");
            
            if(!item) {
                console.log("No item was found.");
                const e : IException = new Exception("NoItemFound", "No item was found for this item id.");
                return res.status(400).send(e)
            }
            const rental : ModelTypes.IRental = new Rental({
                rentingUser: auth.userID,
                sellingUser: item.user,
                shop: item.shop._id,
                item: itemID,
                createdAt: new Date,
                startedRentalAt: null,
                returnedRentalAt: null,
                hasPaid: true,
                amountPaid: 69, // Just for testing...
                chargeID: "randomStringFromStripe",
                stripeCardToken: "cardStripeToken",
            });

            await rental.save();

            return res.status(200).send({ rental: rental });

        } catch(e) {
            console.log(e);
            return res.status(400).json({ success: false,
                                          message: "Unknown error has occured" });
        }
    }

}