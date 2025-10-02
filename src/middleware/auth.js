import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Token requerido" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id, email: payload.email, name: payload.name };
        next();
    } catch {
        return res.status(401).json({ error: "Token inválido" });
    }
}
