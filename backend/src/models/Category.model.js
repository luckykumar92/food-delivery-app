import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    categoryImage: {
        type: String,
        required: true,
        trim: true,
    },
}, {timestamps: true});

export const Category = mongoose.model('Category', categorySchema);