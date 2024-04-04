import mongoose, { Schema } from "mongoose" 

const orderSchema  = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [],
    orderTotal: {
        type: Number,
        required: true,
    },
    deliveryFee: {
        type: Number,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        default: "pending",
        enum: ["pending", "Paid", "Failed"]
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    rating : {
        type: Number,
        default: 0,
        min: 0, 
        max: 5
    },
    feedback: {
        type: String,
        default: ""
    },
    promoCode: {
        type: String,
        default: ""
    },
    discountAmount: {
        type: Number,
        default: 0
    },
})

export const Order = mongoose.model("Order", orderSchema)
