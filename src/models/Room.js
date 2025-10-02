import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        capacity: { type: Number, default: 1, min: 1 },
        amenities: { type: [String], default: [] }
    },
    { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
