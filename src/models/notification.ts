import {model, Schema} from "mongoose";

const validEvents = [
    "transaction",
];

const notificationSchema : Schema = new Schema({
    event: { type: String, enum: validEvents },
    message: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model('Notification', notificationSchema);