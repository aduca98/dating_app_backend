import {model, Schema} from "mongoose";

const shopSchema : Schema = new Schema({
    name: { type: String },
    description: { type: String },
    tags: [ String ],
    images: [ String ],
    location: { longitude: Number, latitude: Number },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: [ { type: Schema.Types.ObjectId, ref: "Item" } ],
    createdAt: { type: Date }
});

export default model('Shop', shopSchema);