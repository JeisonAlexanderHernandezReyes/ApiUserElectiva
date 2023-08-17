const express = require("express");
const User = require("../models/user");

const routes = express.Router();
const allowedDocumentTypes = ["CC", "TI"]; 

// GET all users
routes.get("/", async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({
            status: "success",
            message: "Users fetched successfully.",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error fetching data.",
            data: null,
        });
    }
});

// POST a new user
routes.post("/", async (req, res) => {
    const { Username, DocumentNumber, DocumentType } = req.body;

    if (!allowedDocumentTypes.includes(DocumentType)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid DocumentType.",
            data: null,
        });
    }

    try {
        const userExists = await User.findOne({ where: { Username } });
        const documentExists = await User.findOne({ where: { DocumentNumber } });

        if (userExists || documentExists) {
            return res.status(400).json({
                status: "error",
                message: userExists ? "Username already exists." : "DocumentNumber already exists.",
                data: null,
            });
        }

        await User.create(req.body);
        res.status(201).json({
            status: "success",
            message: "User added successfully.",
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error adding user.",
            data: null,
        });
    }
});

// DELETE a user
routes.delete("/:id", async (req, res) => {
    try {
        const result = await User.destroy({ where: { id: req.params.id } });
        if (result) {
            res.json({
                status: "success",
                message: "User deleted successfully.",
                data: null,
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "User not found.",
                data: null,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error deleting user.",
            data: null,
        });
    }
});

// PUT (update) a user
routes.put("/:id", async (req, res) => {
    try {
        const result = await User.update(req.body, { where: { id: req.params.id } });
        if (result[0]) { // The array returned on update will have a number indicating the count of updated records.
            res.json({
                status: "success",
                message: "User updated successfully.",
                data: null,
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "User not found.",
                data: null,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error updating user.",
            data: null,
        });
    }
});

module.exports = routes;
