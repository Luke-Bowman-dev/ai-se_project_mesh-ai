import {Schema, model} from 'mongoose';
import mongoose from 'mongoose';
import Document from './document.js';

const chunkSchema = new Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: Document, required: true },
    text: {type: String, required: true},
    embedding: {type: [Number], default: []},
    createdAt: { type: Date, default: Date.now }
});

export default model('Chunk', chunkSchema);