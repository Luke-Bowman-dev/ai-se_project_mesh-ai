import {Schema, model} from 'mongoose';
import mongoose from 'mongoose';
import User from './user.js';

const chatSchema = new Schema({
    title: {type: String, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default model('Chat', chatSchema);