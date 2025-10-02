import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
        startAt: { type: Date, required: true },
        endAt: { type: Date, required: true },
        status: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELED"], default: "CONFIRMED" }
    },
    { timestamps: true }
);

bookingSchema.index({ room: 1, startAt: 1, endAt: 1 });

export default mongoose.model("Booking", bookingSchema);
