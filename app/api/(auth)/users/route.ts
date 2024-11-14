import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server"
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;


export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse("Error in Fetching Users " +errorMessage, { status: 500 });
    }

};

export const POST = async (request: Request) => {

    try {
        const body = await request.json();
        await connect();
        const NewUser = new User(body);
        await NewUser.save();

        return new NextResponse(JSON.stringify({ message: "User created successfully", user: NewUser }), { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse("Error in creating User" + errorMessage, { status: 500 });
    }

}


export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUserName } = body;
        console.log(body);

        await connect();

        // Check if userId and newUserName are provided
        if (!userId || !newUserName) {
            console.log("ID or new username not provided!");
            return new NextResponse(
                JSON.stringify({ message: "ID or new username not found" }),
                { status: 400 }
            );
        }

        // Validate the userId format
        if (!ObjectId.isValid(userId)) {
            console.log("Invalid user ID format");
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }

        // Find and update the user
        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) }, // Use ObjectId(userId) after checking its validity
            { username: newUserName },
            { new: true }
        );

        // Check if user was found and updated
        if (!updatedUser) {
            console.log("User not found in the database");
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }),
                { status: 400 }
            );
        }

        console.log("User updated successfully");
        return new NextResponse(
            JSON.stringify({ message: "User updated successfully", user: updatedUser }),
            { status: 200 }
        );

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return new NextResponse(
            `Error in updating User: ${errorMessage}`,
            { status: 500 }
        );
    }
};

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId");

        if (!userId) {
            console.log("ID or new username not provided!");
            return new NextResponse(
                JSON.stringify({ message: "ID or new username not found" }),
                { status: 400 }
            );
        }

        if (!ObjectId.isValid(userId)) {
            console.log("Invalid user ID format");
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }

        await connect();

        const deletedUser = await User.findByIdAndDelete(new ObjectId(userId));

        if (!deletedUser) {
            console.log("User not found in the database");
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }),
                { status: 400 }
            );
        }

        return new NextResponse(JSON.stringify({ message: "User deleted successfully", userId: deletedUser.userId }),
            { status: 200 })


    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse("Error in deleting user" + errorMessage, { status: 500 })

    }

}