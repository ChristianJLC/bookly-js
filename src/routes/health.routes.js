import { Router } from "express";
import mongoose from "mongoose";
const router = Router();

router.get("/health", (_req, res) => {
    const mongo = mongoose.connection.readyState === 1;
    res.json({ ok: true, mongo });
});

export default router;
