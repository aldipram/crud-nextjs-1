import { connect } from "@/lib/db";
import { Note } from "@/lib/models/notes";
import { User } from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// GET notes
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId"}), { status: 400 })
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message    : "User not found"}), { status: 404 })
        }

        const notes = await Note.find({user: new Types.ObjectId(userId)})

        return new NextResponse(JSON.stringify(notes), { status: 200 });

    } catch (error) {
        return new NextResponse("Error in fetching notes" + error, { status: 500 });
    }
}

// POST
export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        const body = await request.json();
        const { title, description } = body;
        
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId"}), { status: 400 })
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found"}), { status: 404 })
        }

        const newNote = new Note({
            title,
            description,
            user: new Types.ObjectId(userId),
        });

        await newNote.save();
        
        return new NextResponse(JSON.stringify({ message: "Note created", note: newNote}), { status: 201 });

    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error in creating note", error}), { status: 500 })
    }
}

// PATCH
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { noteId, title, description } = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing noteId"}), { status: 400 });
        }

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId"}), { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found"}), { status: 404 });
        }

        const note = await Note.findOne({ _id: noteId, user: userId });
        if (!note) {
            return new NextResponse(JSON.stringify({ message: "Note not found or does not belong to the user"}), { status: 404 });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, description },
            { new: true }
        )

        return new NextResponse(JSON.stringify({ message: "Note updated", note: updatedNote }), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error in updating note"}), { status: 500 })
    }
}

// DELETE 
export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get("noteId");
        const userId = searchParams.get("userId");

        if (!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing noteId"}), { status: 400 });
        }

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId"}), { status: 400})
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found"}), { status: 404 })
        }

        const note = await Note.findOne({ _id: noteId, user: userId });
        if (!note) {
            return new NextResponse(JSON.stringify({ message: "Note not found or does not belong to the user"}), { status: 404 })
        }

        await Note.findByIdAndDelete(noteId);

        return new NextResponse(JSON.stringify({ message: "Note deleted successfully"}), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting note"}), { status: 500 })
    }
}