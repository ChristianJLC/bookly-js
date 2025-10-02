import { Router } from "express";
import { body, validationResult } from "express-validator";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Crear reserva con anti-solapamiento
router.post(
    "/",
    requireAuth,
    body("roomId").isString(),
    body("startAt").isISO8601(),
    body("endAt").isISO8601(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { roomId, startAt, endAt } = req.body;
            const start = new Date(startAt);
            const end = new Date(endAt);
            if (end <= start) return res.status(400).json({ error: "endAt debe ser mayor a startAt" });

            const room = await Room.findById(roomId);
            if (!room) return res.status(404).json({ error: "Sala no encontrada" });

            const clash = await Booking.findOne({
                room: roomId,
                status: "CONFIRMED",
                $nor: [{ endAt: { $lte: start } }, { startAt: { $gte: end } }]
            });

            if (clash) return res.status(409).json({ error: "La sala ya está reservada en ese horario" });

            const booking = await Booking.create({
                user: req.user.id,
                room: roomId,
                startAt: start,
                endAt: end,
                status: "CONFIRMED"
            });

            res.status(201).json(await booking.populate("room", "name capacity amenities"));
        } catch (e) { next(e); }
    }
);

router.get("/mine", requireAuth, async (req, res, next) => {
    try {
        const list = await Booking.find({ user: req.user.id })
            .populate("room", "name capacity amenities")
            .sort({ startAt: 1 });
        res.json(list);
    } catch (e) { next(e); }
});

export default router;
