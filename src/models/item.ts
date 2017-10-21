import {model, Schema} from "mongoose";

const itemSchema : Schema = new Schema({
    name: { type: String },
    description: { type: String },
    tags: [ String ],
    images: [ String ],
    price: { type: Number },
    rating: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    createdAt: { type: Date },
    deleted: { type: Boolean, defualt: false }
});

export default model('Item', itemSchema);