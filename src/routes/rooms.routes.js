import { Router } from "express";
import { body, validationResult } from "express-validator";
import Room from "../models/Room.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res, next) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });
        res.json(rooms);
    } catch (e) { next(e); }
});

router.post(
    "/",
    requireAuth,
    body("name").isString().isLength({ min: 2 }),
    body("capacity").optional().isInt({ min: 1 }),
    body("amenities").optional().isArray(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const room = await Room.create({
                name: req.body.name,
                capacity: req.body.capacity ?? 1,
                amenities: req.body.amenities ?? []
            });
            res.status(201).json(room);
        } catch (e) { next(e); }
    }
);

export default router;
