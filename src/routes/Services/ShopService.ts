import * as mongoose from 'mongoose';
import * as ModelTypes from '../../models/interfaces';
import { IJwtAuth } from '../../utils/tokenAuthenticationMiddleware';
import Exception, { IException, defaultApiError } from '../../utils/Exception';

const User = mongoose.model('User');
const Shop = mongoose.model('Shop');
const Item = mongoose.model('Item');

var ObjectID = require("mongodb").ObjectID;

export default class ShopService {

     /**
     * @api {get}  /api/local-shops Gets all of shops you have created, should only be 1
     * @apiparams: N/A
     * @apiquery: N/A
     * @apidata: 
     * {
     *      location
     * }
     * @apiSuccess:
     * {
     *      success: true,
     *      shop: {IShop},
     * }
     * @apiFailure: 
     * {
     *      success: false,
     *      message: {string}
     * }
     */
    static async findLocalShops(req, res) {

        const {
            location
        } = req.body;

        const latitude : number = location.latitude;
        const longitude : number = location.longitude;
        // Computing range...
        const latMin : number = latitude - .01;
        const latMax : number = latitude + .01;
        const lngMin : number = longitude - .01;
        const lngMax : number = longitude + .01;

        // Do database query and return a shop... 
        // For now just return all shops
        try {
            const shops : ModelTypes.IShop[] = await Shop.find({});
            return res.status(200).json({ success: true, 
                                          shops: shops });
        } catch(e) {
            return res.status(200).json({ success: false, 
                                          message: "Error finding shops."})
        }
        

    }
     /**
     * @api {get} /api/shops Needs authentication
     * @apiDefinition: Gets all of shops you have created, should only be 1
     * @apiparams: N/A
     * @apiquery: 
     *      items: boolean
     * @apidata: 
     * {
     *      jwt,
     * }
     * @apiSuccess:
     * {
     *      success: true,
     *      shop: {IShop},
     * }
     * @apiFailure: 
     * {
     *      success: false,
     *      message: {string}
     * }
     */
    public static async getUsersShops(req, res) {
        const { 
            jwt
        } = req.body;
        const auth : IJwtAuth = res.locals.jwtAuth;
        const shouldGetItems = (req.query.items) === "true" ? "items" : ""; // For populate db query

        if(!auth.isAuthorized) return res.status(403).json({ success: false, 
                                                             message: auth.message });
        console.log(auth);
        const userID = auth.userID
        try {
            const shop : ModelTypes.IShop = await Shop.findOne({ user: userID }).populate(shouldGetItems);
 
            console.log(shop);
            return res.status(200).json({ success: true,
                                            shop: shop,
                                            items: shop.items });

        } catch(e) {
            console.log(e);
            return res.status(400).json({ success: false, 
                                          message: "Database error occured..." });
        }
    }

     /**
     * @api {get} /api/shops/:id Needs authentication, tokenAuthenticationMiddleware
     * @apiDefinition: Gets information for a specific shop
     * 
     * @apiParam {boolean} items Query if should retrieve items.
     * 
     */
    public static async getShop(req, res) {
        const { id } = req.params;
        const shouldGetItems = (req.query.items) === "true" ? "items" : ""; // For populate db query

        try {
            const shop = await Shop.findById(id).populate(shouldGetItems);
            if(!shop) return res.status(200).json({ success: false,
                                                    message: "No shop with this id exists." });
            return res.status(200).json({ success: true, 
                                          shop: shop });
        } catch(e) {
            return res.status(200).json({ success: false,
                                          message: "Database failure." })
        }
    }

     /**
     * @api {post} /api/shops/create Creates a shop
     * @apiparams: N/A
     * @apiquery: N/A
     * @apidata: 
     * {
     *      name,
     *      description,
     *      location: { longitude: {number}, latitude: {number} }
     *      images: {string[]},
     * }
     * @apiSuccess: 
     * {
     *      success: true,
     *      shop: {IShop}
     * }
     */
    public static async createShop(req, res) {
        const {
            name,
            description,
            location,
            images,
        } = req.body;
        
        console.log(req.body);
        const createdAt = new Date();
        const auth : IJwtAuth = res.locals.jwtAuth;
        console.log(auth);

        if(!auth.isAuthorized) return res.status(403).json({ success: false, 
                                                             message: auth.message });
        // Check auth eventually...
        const newShop = new Shop({
            createdAt,
            description,
            name,
            user: auth.userID,
            images,
            location: {
                longitude: location.longitude,
                latitude: location.latitude
            },
        });

        console.log(newShop);

        try {
            const shops = await Shop.find({ user: auth.userID });
            if(shops.length > 0) return res.status(200).json({ success: false,
                                                               shop: shops[0],
                                                               message: "You already have a shop... cannot make multiple." });
            await newShop.save();
            return res.status(200).json({ success: true, 
                                          shop: newShop })
        } catch(e) {
            console.log(e);
            return res.status(400).json(e);
        }

        // make sure not already a Shop...
    }

    /**
     * @api {put} /api/shops/update-info/:id Update a shop
     * @apiDefinition: Updates a shop given information
     * 
     * @apiParam {string} name The new name of the shop
     * @apiParam {string} description The new description of the shop
     * 
     */
     public static async updateShop(req, res) {
        const {
            name,
            description,
        } = req.body;
        const { id } = req.params;

        const data = {
            name,
            description,
        }
        console.log(req.body);
        try {
            const updatedShop : ModelTypes.IShop = await Shop.findByIdAndUpdate(id, data, {new: true});
            return res.status(200).json({ success: true,
                                          shop: updatedShop });
        } catch(e) {
            console.log(e);
            const err = defaultApiError(400, 
                                        "failed_update", 
                                        "Failed to update the shop.");
            return res.status(400).json(err);
        }

     }

    /**
     * @api {put} /api/shops/update-location/:id Update a shop
     * @apiDefinition: Updates a shops location
     * 
     * @apiParam {Object} location Location of a shop
     * @apiParam {string} 
     * 
     */
     public static async updateShopLocation(req, res) {

     }

    /**
     * @api {post} /api/shops/add-item/:id Add Item
     * @apiDefinition Creates an item and adds it to the shop.
     * 
     * @apiParam {string} name Name of item
     * @apiParam {string} name Description of shop
     * @apiParam {number} price Price of item
     * @apiParam {string[]} tags Tags for item
     * 
     */
    public static async addItemAndSaveToShop(req, res) {
        console.log("Adding item");

        const {
            name,
            description,
            price,
            tags
        } = req.body;

        const shopID = req.params.id;
        const itemID = new ObjectID();

        const auth : IJwtAuth = res.locals.jwtAuth;

        if(!auth.isAuthorized) {
            console.log(auth.message);
            return res.status(403).json({ success: false, message: auth.message });
        }

        try {
            // Check is shop exists
            const shop : ModelTypes.IShop | null = await Shop.findById(shopID);

            console.log(shop);

            if(!shop) {
                console.log("No shop");
                return res.status(404).json({message: "No shop found."});
            }
                
            var i = new Item({
                _id: itemID,
                name,
                description,
                price,
                tags,
                createdAt: new Date(),
                user: auth.userID,
                shop: shop._id
            });

            console.log(i);
            await i.save();
            
            // Push item into the updated shop
            const updatedShop = await Shop.findByIdAndUpdate(shopID, { $push: {items: i._id} }, { new: true });
            console.log("NEW SHOP " + updatedShop);

            return res.status(200).json({ success: true,  
                                          shop: updatedShop,    
                                          item: i });
        } catch(e) {
            console.log(e);
            return res.status(400).json({});
        }

    }

    /**
     * @api {get} /api/shops/item-details/:id Item details
     * @apiDefinition This gets the details for a given item.
     */
    public static async getItemDetails(req, res) {
        
        const itemID = req.params.id;

        const auth : IJwtAuth = res.locals.jwtAuth;

        if(!auth.isAuthorized) {
            console.log(auth.message);
            return res.status(403).json({ success: false, message: auth.message });
        }

        try {
            // Check is shop exists
            const item : ModelTypes.IItem = await Item.findById(itemID);
            return res.status(200).json({ success: true,  
                                          item: item });
        } catch(e) {
            console.log(e);
            return res.status(400).json({});
        }

    }
    
    /**
     * @api {put} /api/shops/remove-item/:shopID/:itemID Removes an item from a shop
     * @apiDefinition Remove an item from a shop and mark it as deleted in db 
     */
    public static async removeItemFromShop(req,res) {
        const { 
            shopID, 
            itemID 
        } = req.params;
        const auth : IJwtAuth = res.locals.jwtAuth;

        if(!auth.isAuthorized) {
            console.log(auth.message);
            return res.status(403).json({ success: false, message: auth.message });
        }
        // Make sure that the user really owns the shop that removing item from
        const shop : ModelTypes.IShop = await Shop.findById(shopID).populate("user");
        if(shop.user._id != auth.userID) {
            console.log("Not your shop, bitch");
            const e : IException = new Exception("NotYourShop", "This is not your shop.");
            return res.status(500).send(e);
        }
        const query = { $pull: { items: itemID } };
        const newShop = await Shop.findByIdAndUpdate(shopID, query, {new: true});
        const newItem = await Item.findByIdAndUpdate(itemID, { "deleted": true }, {new:true});
        return res.status(200).json({ success: true,
                                      shop: newShop,
                                      item: newItem });
    }

    /**
     * @api {get} /api/shops/current-rentals/:id Current Rentals
     * @apiDefinition Gets all current rentals for a shop that have not been returned
     */
    public static async getCurrentRentals() {

    }

    /**
     * @api {get} /api/shops/all-rentals/:id All Rentals
     * @apiDefinition Gets all rentals for a shop, current and ones returned
     */
    public static async getAllRentals() {

    }

}