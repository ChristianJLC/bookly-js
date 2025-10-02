import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

router.post(
    "/register",
    body("name").isString().isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { name, email, password } = req.body;
            const exists = await User.findOne({ email });
            if (exists) return res.status(409).json({ error: "Email ya registrado" });

            const passwordHash = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, passwordHash });
            res.status(201).json({ id: user._id, name: user.name, email: user.email });
        } catch (e) { next(e); }
    }
);

router.post(
    "/login",
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

            const ok = await bcrypt.compare(password, user.passwordHash);
            if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

            const token = jwt.sign(
                { id: user._id, email: user.email, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.json({ token });
        } catch (e) { next(e); }
    }
);

export default router;
