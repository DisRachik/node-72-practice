const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // отримуємо токен
    // розшифровуємо токен
    // передаємо інфо з токена далі

    try {
        const [bearer, token] = req.headers.authorization.split(' ');

        if (bearer === 'Bearer' && token) {
            const decoded = jwt.verify(token, 'pizza');

            req.user = decoded;

            next();
        }
    } catch (error) {
        res.status(401);
        res.json({ code: 401, message: error.message });
    }
};

// {
//   "friends": [
//     "Pol",
//     "Tom",
//     "Bob"
//   ],
//   "id": "64cf61ea3101bc940d940533",
//   "roles": [
//     "USER"
//   ],
//   "iat": 1691312719,
//   "exp": 1691323519
// }
