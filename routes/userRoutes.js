const express = require("express");
const routes = express.Router();

const allowedDocumentTypes = [
  "CC",
  "TI",
  "PA",
  "RC",
  "CM",
  "CD",
  "DP",
  "TT",
  "CL",
  "CE",
];

routes.get("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err)
      return res.status(500).json({
        status: "error",
        message: "Database connection error.",
        data: null,
      });

    conn.query("SELECT * FROM Users", (err, rows) => {
      if (err)
        return res.status(500).json({
          status: "error",
          message: "Error fetching data.",
          data: null,
        });

      res.json({
        status: "success",
        message: "Users fetched successfully.",
        data: rows,
      });
    });
  });
});

routes.post("/", (req, res) => {
  const { Username, DocumentNumber, DocumentType } = req.body;
  if (!allowedDocumentTypes.includes(DocumentType)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid DocumentType.",
      data: null,
    });
  }
  req.getConnection((err, conn) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database connection error.",
        data: null,
      });
    }
    conn.query(
      "SELECT * FROM Users WHERE Username = ?",
      [Username],
      (err, rows) => {
        if (rows.length) {
          return res.status(400).json({
            status: "error",
            message: "Username already exists.",
            data: null,
          });
        }

        conn.query(
          "SELECT * FROM Users WHERE DocumentNumber = ?",
          [DocumentNumber],
          (err, rows) => {
            if (rows.length) {
              return res.status(400).json({
                status: "error",
                message: "DocumentNumber already exists.",
                data: null,
              });
            }

            conn.query("INSERT INTO Users set ?", [req.body], (err) => {
              if (err) {
                return res.status(500).json({
                  status: "error",
                  message: "Error adding user.",
                  data: null,
                });
              }

              res.status(201).json({
                status: "success",
                message: "User added successfully.",
                data: null,
              });
            });
          }
        );
      }
    );
  });
});

routes.delete("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err)
      return res.status(500).json({
        status: "error",
        message: "Database connection error.",
        data: null,
      });

    conn.query("DELETE FROM Users WHERE Id = ?", [req.params.id], (err) => {
      if (err)
        return res.status(500).json({
          status: "error",
          message: "Error deleting user.",
          data: null,
        });

      res.json({
        status: "success",
        message: "User deleted successfully.",
        data: null,
      });
    });
  });
});

routes.put("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err)
      return res.status(500).json({
        status: "error",
        message: "Database connection error.",
        data: null,
      });

    conn.query(
      "UPDATE Users set ? WHERE Id = ?",
      [req.body, req.params.id],
      (err) => {
        if (err)
          return res.status(500).json({
            status: "error",
            message: "Error updating user.",
            data: null,
          });

        res.json({
          status: "success",
          message: "User updated successfully.",
          data: null,
        });
      }
    );
  });
});

module.exports = routes;
