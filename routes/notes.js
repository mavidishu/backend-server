// Used for notes rendering
const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// fetchallnotes using: GET "/api/notes/fetchallnotes". Login required.(for this our header must include authentication token in it.)
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Add a new node using: POST "/api/notes/addnote". Login required.
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "minimum length must be 3").isLength({ min: 3 }),
    body("description", "description should not be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = new Note({
        // returns promise
        user: req.user.id,
        title,
        description,
        tag,
        time: Date.now(),
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (errors) {
      console.error(errors.message);
      res.status(400).send("Internal error occured");
    }
  }
);

// Updating note using: PUT '/api/notes/updatenote:id'. Login Required.(We require note id for updating note)
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    const noteId = req.params.id.substring(1);
    let note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    console.log(typeof noteId, typeof req.user.id);
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      noteId,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;

// Delteing a note using: DELETE '/api/notes/deletenote:id'. Login Required.
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    const noteId = req.params.id.substring(1);
    let note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow deleteion only if that note belong to that user.
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(noteId);
    res.json({ seccess: "Note has been deleted." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
/*  Useful Comments */

/* res.json() always return a javascript object*/
/*{$set:newNote}: updating the fields given in newNote*/
/*{new:true}: This will allow saving the updates*/
