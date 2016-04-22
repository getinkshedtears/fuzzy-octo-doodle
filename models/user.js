var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    createDate: Date,
    facebook         : {
        id           : String,
        token        : String,
        name         : String
    },
    attending: Array,
    lastSearch: String
});

userSchema.methods.setUsername = function(str) {
    this.username = str;
    this.save();
};

userSchema.methods.addAttending = function(id) {
    this.attending.push(id);
    this.save();
};

userSchema.methods.removeAttending = function(id) {
    var index = this.attending.indexOf(id);
    this.attending.splice(index, 1);
    this.save();
};

userSchema.methods.setLastSearch = function(search) {
    this.lastSearch = search;
    this.save();
};

module.exports = mongoose.model('User', userSchema);