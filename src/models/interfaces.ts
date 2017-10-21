import * as mongoose from 'mongoose';

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    email: string,
    fbId: string,
	fbToken: string,
    pictureUrl: string,
    interestedIn: string,
    gender: string,
    selfDescription: string,
    matchDescription: string
    matchKeywords: string[],
	selfKeywords: string[],
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