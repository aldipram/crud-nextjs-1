import { connect } from "@/lib/db"
import { User } from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"

const ObjectId = require("mongoose").Types.ObjectId;

// GET
export const GET = async () => {
    try {
        await connect();

        const users = await User.find();

        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new NextResponse("Error fetching users", { status: 500 });
    }
}

// POST
export const POST = async (request: Request) => {
    try {
        const body = await request.json();

        await connect();
        const newUser = new User(body);
        await newUser.save()

        return new NextResponse(JSON.stringify({ message: "User is created", user: newUser }), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error creating user", error }), { status: 500 });
    }
}

// PATCH
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;

        await connect();

        if (!userId || !newUsername) {
            return new NextResponse(JSON.stringify({ message: "ID or new username are required" }), { status: 400 })
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid userId" }), { status: 400 })
        }

        const updatedUser = await User.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {username: newUsername},
            {new: true}
        )

        if (!updatedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found or didn't update succesfully." }), { status: 404 })
        }

        return new NextResponse(JSON.stringify({ message: "Username updated successfully", user: updatedUser}), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error updating username", error }), { status: 500 })
    }
}

// DELETE
export const DELETE = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId")

        if (!userId) {
            return new NextResponse(JSON.stringify({ message: "UserId is required"}), { status: 400 })
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid userId"}), { status: 400 })
        }

        await connect();

        // TODO
        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        )

        if (!deletedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found"}), { status: 404 })
        }

        return new NextResponse(JSON.stringify({ message: "User deleted successfully"}), { status: 200 })

    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error deleting user", error}), { status: 500 })
    }
}