import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
    title: { type: String, required: true,},
    description: { type: String},
    user: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Note = models.Note || model("Note", NoteSchema)