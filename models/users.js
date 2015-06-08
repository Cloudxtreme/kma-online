var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
	autoIncrement = require('mongoose-auto-increment');
 
var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
	var user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();
 
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	    if (err) return next(err);
	 
	    // hash the password along with our new salt
	    bcrypt.hash(user.password, salt, function(err, hash) {
	    	if (err) return next(err);
	 
	        // override the cleartext password with the hashed one
	        user.password = hash;
	        next();
	    });
	});
});

UserSchema.methods.comparePassword = function(candidatePassword) {
	var user = this;
	return new Promise(function (fulfill, reject) {
		bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
	        if (err) reject(err);
	        fulfill(isMatch);
		});
    });
};

UserSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User', UserSchema);