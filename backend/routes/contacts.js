
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET: Fetch all contacts
router.get("/", async (req, res) => {
  try {
    const [contacts] = await pool.query(
      "SELECT * FROM contacts ORDER BY id DESC"
    );

    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

// POST: Add a new contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)",
      [name, email, phone || null]
    );

    res.status(201).json({
      message: "Contact created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ message: "Failed to create contact" });
  }
});


 // GET: Fetch one contact by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        message: "Invalid contact ID",
      });
    }

    const [contacts] = await pool.query(
      "SELECT * FROM contacts WHERE id = ?",
      [Number(id)]
    );

    if (contacts.length === 0) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.status(200).json(contacts[0]);
  } catch (error) {
    console.error("Error fetching contact:", error.message);
    res.status(500).json({
      message: "Failed to fetch contact",
    });
  }
});


 // PUT: Update an existing contact
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        message: "Invalid contact ID",
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const [result] = await pool.query(
      "UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email, phone || null, Number(id)]
    );

    if (result.affectedRows === 0) {
      const [contacts] = await pool.query(
        "SELECT id FROM contacts WHERE id = ?",
        [Number(id)]
      );

      if (contacts.length === 0) {
        return res.status(404).json({
          message: "Contact not found",
        });
      }
    }

    res.status(200).json({
      message: "Contact updated successfully",
      id: Number(id),
    });
  } catch (error) {
    console.error("Error updating contact:", error.message);
    res.status(500).json({
      message: "Failed to update contact",
    });
  }
});


 // DELETE: Remove a contact by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        message: "Invalid contact ID",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM contacts WHERE id = ?",
      [Number(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.status(200).json({
      message: "Contact deleted successfully",
      id: Number(id),
    });
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    res.status(500).json({
      message: "Failed to delete contact",
    });
  }
});


module.exports = router;
