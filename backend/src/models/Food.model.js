import mongoose, { Schema } from 'mongoose';

const foodSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        min: 1,
        required: true,
    },
    foodImage: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        max: 5,
        default: 0,
    },
    ratingCount: {
        type: String,
        default: 0,
    }
});

export const Food = mongoose.model('Food', foodSchema);