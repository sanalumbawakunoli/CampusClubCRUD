
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper: validate the record ID
function getValidId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// Helper: validate club data
function validateClub(body) {
    const fields = [
        "name",
        "category",
        "description",
        "president",
        "email",
        "meeting_day"
    ];

    for (const field of fields) {
        if (
            typeof body[field] !== "string" ||
            body[field].trim() === ""
        ) {
            return `${field} is required and must be a non-empty string.`;
        }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
        return "Please provide a valid email address.";
    }

    return null;
}

// GET: List all clubs
app.get("/api/clubs", (req, res) => {
    const clubs = db.prepare(
        "SELECT * FROM clubs ORDER BY id"
    ).all();

    res.json({
        success: true,
        count: clubs.length,
        data: clubs
    });
});

// GET: Retrieve one club
app.get("/api/clubs/:id", (req, res) => {
    const id = getValidId(req.params.id);

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid club ID."
        });
    }

    const club = db.prepare(
        "SELECT * FROM clubs WHERE id = ?"
    ).get(id);

    if (!club) {
        return res.status(404).json({
            success: false,
            message: "Club not found."
        });
    }

    res.json({
        success: true,
        data: club
    });
});

// POST: Create a club
app.post("/api/clubs", (req, res) => {
    const error = validateClub(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error
        });
    }

    const insert = db.prepare(`
        INSERT INTO clubs
        (name, category, description, president, email, meeting_day)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
        req.body.name.trim(),
        req.body.category.trim(),
        req.body.description.trim(),
        req.body.president.trim(),
        req.body.email.trim(),
        req.body.meeting_day.trim()
    );

    const club = db.prepare(
        "SELECT * FROM clubs WHERE id = ?"
    ).get(Number(result.lastInsertRowid));

    res.status(201).json({
        success: true,
        message: "Club created successfully.",
        data: club
    });
});

// PUT: Update an existing club
app.put("/api/clubs/:id", (req, res) => {
    const id = getValidId(req.params.id);

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid club ID."
        });
    }

    const existingClub = db.prepare(
        "SELECT id FROM clubs WHERE id = ?"
    ).get(id);

    if (!existingClub) {
        return res.status(404).json({
            success: false,
            message: "Club not found."
        });
    }

    const error = validateClub(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error
        });
    }

    db.prepare(`
        UPDATE clubs
        SET name = ?,
            category = ?,
            description = ?,
            president = ?,
            email = ?,
            meeting_day = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        req.body.name.trim(),
        req.body.category.trim(),
        req.body.description.trim(),
        req.body.president.trim(),
        req.body.email.trim(),
        req.body.meeting_day.trim(),
        id
    );

    const updatedClub = db.prepare(
        "SELECT * FROM clubs WHERE id = ?"
    ).get(id);

    res.json({
        success: true,
        message: "Club updated successfully.",
        data: updatedClub
    });
});

// DELETE: Delete a club
app.delete("/api/clubs/:id", (req, res) => {
    const id = getValidId(req.params.id);

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid club ID."
        });
    }

    const club = db.prepare(
        "SELECT * FROM clubs WHERE id = ?"
    ).get(id);

    if (!club) {
        return res.status(404).json({
            success: false,
            message: "Club not found."
        });
    }

    db.prepare(
        "DELETE FROM clubs WHERE id = ?"
    ).run(id);

    res.json({
        success: true,
        message: "Club deleted successfully.",
        data: club
    });
});

// Handle unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found."
    });
});

// Handle malformed JSON requests
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body."
        });
    }

    next(err);
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Campus Club API running at http://localhost:${PORT}`);
});

// Close resources cleanly
function shutdown() {
    server.close(() => {
        db.close();
        process.exit(0);
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
