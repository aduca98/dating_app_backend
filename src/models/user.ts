import {model, Schema} from 'mongoose';
import bcrypt = require('bcrypt-nodejs');

const userSchema : Schema = new Schema({
    name: { type: String},
    email: { type: String, unique: true },
	fbId: { type: String },
	fbToken: { type: String },
	pictureUrl: { type: String },
	gender: { type: String, enum: ['male', 'female'] },
	interestedIn: { type: String, enum: ['male', 'female']},

	selfCategories: { type: Array },
	matchCategories: { type: Array },

    selfDescription: { type: String },
    matchDescription: { type: String },

    matchEntitySalience: { type: Array },
	selfEntitySalience: { type: Array },

	createdAt: { type: Date }
});

userSchema.pre("save", function (next) {
	const user = this;
	if (!this.createdAt)
		this.createdAt = new Date();

	bcrypt.genSalt(8, (err, salt) => {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) return next(err);
			user.password = hash;
			return next();
		});
	});
});

userSchema.methods.comparePassword = function (candidatePassword) {
	if (!this.password)
		return Promise.resolve(false);
	
	return new Promise((resolve, reject) => {
		return bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
			if (err)
				reject(err);
			else
				resolve(isMatch);
		});
	})
};

export default model('User', userSchema);