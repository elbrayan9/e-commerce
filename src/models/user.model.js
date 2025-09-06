import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts' // Referencia al modelo de Carritos
    },
    role: { type: String, default: 'user' }
});

export const UserModel = mongoose.model('users', userSchema);