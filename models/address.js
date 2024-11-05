const mongoose = require('mongoose');
const {Schema} = mongoose;

const AddressSchema = new Schema(
    {
        userId : String,
        address : String,
        city: String,
        pinCode: String,
        phone: String,
        notes: String,
    },
    {timestamps: true}
);

module.exports = mongoose.model("Address", AddressSchema);