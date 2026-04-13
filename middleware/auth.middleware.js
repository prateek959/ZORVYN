import jwt from 'jsonwebtoken';

const checkToken = async (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization || req.headers.Authorization;

        if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized Access" });
        };

        const token = authHeaders.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decode;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const checkRole = (...roles) => {
    return async (req, res, next) => {
        try {
            const UserRole = req.user.role;
            if (!roles.includes(UserRole)) {
               return res.status(401).json({ message: "Forbidden Access" });
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Invalid or Expired Token" });
        }
    }
};


export {checkToken, checkRole};