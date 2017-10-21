import * as mongoose from 'mongoose';

export interface IRental {
    _id: mongoose.Schema.Types.ObjectId
    rentingUser: mongoose.Schema.Types.ObjectId | IUser,
    sellingUser: mongoose.Schema.Types.ObjectId | IUser,
    shop: mongoose.Schema.Types.ObjectId | IShop,
    item: mongoose.Schema.Types.ObjectId | IItem,
    createdAt: Date,
    startedRentalAt: Date,
    returnedRentalAt: Date ,
    hadPaid: boolean,
    amountPaid: number,
    chargeID: string,
    stripeCardToken: string,
    save: (callback?: any) => Promise<any>
}

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    resetPasswordToken: string,
    resetPasswordTokenExpiration: Date,
    createdAt: Date,
    lastInteraction: Date,
    // Methods:
    comparePassword: (candidatePassword: string) => Promise<boolean>,
}

export interface IShop {
    _id: mongoose.Schema.Types.ObjectId
    name: string,
    description: string,
    tags: string[],
    images: string[],
    location: { longitude: number, latitude: number },
    user: mongoose.Schema.Types.ObjectId | IUser,
    items: mongoose.Schema.Types.ObjectId[] | IItem[],
    createdAt: Date,
}

export interface IItem {
    name: string,
    description: string,
    tags: string[],
    images: string[],
    price: number,
    rating: number,
    user: mongoose.Schema.Types.ObjectId | IUser,
    shop: mongoose.Schema.Types.ObjectId | IShop,
    createdAt: Date,
    deleted: boolean
}

export interface INotification {
    event: string,
    message: string,
    user: mongoose.Schema.Types.ObjectId | IUser
}
