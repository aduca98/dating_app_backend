import * as mongoose from 'mongoose';

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    fbId: string,
	fbToken: string,
    pictureUrl: string,
    interestedIn: string,
    gender: string,
    age: string,
    
    selfCategories: Object[],
	matchCategories: Object[],

    selfDescription: string,
    matchDescription: string,
    
    matchEntitySalience: Object[],
	selfEntitySalience: Object[],

	createdAt: Date,
    comparePassword: (candidatePassword : string) => Promise<any>,
    save: () => Promise<any>,
}

export interface IMatch {
    userOne: mongoose.Schema.Types.ObjectId,
    userTwo: mongoose.Schema.Types.ObjectId,
    matchDate: Date,
    commonKeywords: string[],
    commonRate: number
}