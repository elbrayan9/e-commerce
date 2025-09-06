import passport from 'passport';
import jwt from 'passport-jwt';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Esta es nuestra clave secreta para firmar los tokens. ¡Debe ser segura y no compartirse!
const JWT_SECRET = 'CoderSecret';

const initializePassport = () => {

    // Función que extrae la cookie del request
    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['coderCookieToken']; // Mismo nombre que seteamos en el login
        }
        return token;
    };

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET,
    }, async (jwt_payload, done) => {
        try {
            // El payload del JWT contiene el usuario. Lo extraemos.
            // jwt_payload.user ya tiene toda la info del usuario, no necesitamos buscarlo en la DB de nuevo.
            return done(null, jwt_payload.user);
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;