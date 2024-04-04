import mongoose, {Schema} from 'mongoose';

const AddressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    addressLine1: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    addressLine2: {
        type: String,
        trim: true,
        maxlength: 100
    },
    city: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    state: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    pincode: {
        type: String,
        required: true,
        trim: true,
        maxlength: 6
    },
    deliveryInstruction: {
        type: String,
        trim: true,
        maxlength: 100,
        default: ""
    },
})

export const Address = mongoose.model('Address', AddressSchema);