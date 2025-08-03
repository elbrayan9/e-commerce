import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products' // Clave: Referencia al modelo de Productos
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        default: []
    }
});

// Middleware para que 'populate' se ejecute automáticamente cada vez que busquemos un carrito
cartSchema.pre('findOne', function(next) {
    this.populate('products.product');
    next();
});

export const CartModel = mongoose.model('carts', cartSchema);