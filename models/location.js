var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    yelpId: String,
    attending: Number
})

locationSchema.methods.addAttending = function() {
    this.attending++;
    this.save()
}

locationSchema.methods.removeAttending = function() {
    this.attending--;
    this.save();
    if (this.attending === 0) {
        this.remove();
    }
}

module.exports = mongoose.model('Location', locationSchema);