import { Router } from 'express';
import { UserModel } from '../models/user.model.js';
import { CartModel } from '../models/cart.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router();
const JWT_SECRET = 'CoderSecret'; // Misma clave secreta que en passport.config.js

// --- REGISTER ---
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: 'error', message: 'El correo electrónico ya está registrado.' });
        }
        
        // 1. Crear un carrito nuevo para el usuario
        const newCart = await CartModel.create({});

        // 2. Hashear la contraseña
        const hashedPassword = bcrypt.hashSync(password, 10);

        // 3. Crear el nuevo usuario
        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: newCart._id // Asignamos el ID del carrito recién creado
        });

        res.status(201).json({ status: 'success', message: 'Usuario registrado con éxito', payload: newUser });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' });
        }

        // Creamos un objeto con la info del usuario (sin el password)
        const userPayload = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            cart: user.cart,
            role: user.role
        };

        // Generamos el token JWT
        const token = jwt.sign({ user: userPayload }, JWT_SECRET, { expiresIn: '1h' });

        // Seteamos el token en una cookie
        res.cookie('coderCookieToken', token, {
            httpOnly: true, // La cookie no es accesible por JS en el cliente
            maxAge: 3600000 // 1 hora de expiración
        });

        res.json({ status: 'success', message: 'Login exitoso' });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// --- CURRENT ---
// Usamos el middleware de passport con la estrategia 'current'
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    // Si la estrategia 'current' de Passport fue exitosa, el usuario estará en req.user
    res.json({ status: 'success', payload: req.user });
});


export default router;