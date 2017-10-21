import {model, Schema} from "mongoose";

const rentalItemSchema : Schema = new Schema({
    rentingUser: { type: Schema.Types.ObjectId, ref: "User" },
    sellingUser: { type: Schema.Types.ObjectId, ref: "User"},
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    item: { type: Schema.Types.ObjectId, ref: "Item" },
    createdAt: { type: Date }, // When the rental is registered in system
    startedRentalAt: { type: Date }, // When rental is actually picked up
    returnedRentalAt: { type: Date },
    hasPaid: { type: Boolean },
    amountPaid: { type: Number },
    chargeID: { type: String },
    stripeCardToken: { type: String }, // So we can charge for overdue
});

export default model('Rental', rentalItemSchema);