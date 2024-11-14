import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server"
import { Types } from "mongoose";
import mongoose from "mongoose";
import Categorias from "@/lib/modals/category";


const { ObjectId } = mongoose.Types;


export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // Check for a valid userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }), 
                { status: 404 }
            );
        }

        // Connect to the database
        await connect();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }), 
                { status: 400 }
            );
        }

        // Find categories associated with the userId
        const categorias = await Categorias.find({ userId: new Types.ObjectId(userId) });

        // Return categories as JSON
        return new NextResponse(
            JSON.stringify( categorias ), 
            { status: 200 }
        );

    } catch (err: unknown) {
        // Handle errors and return 500 status
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return new NextResponse(
            
            JSON.stringify({ message: "Error: " + errorMessage }), 
            { status: 500 }
        );
    }
};


export const POST = async (request : Request) =>{
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const {title} = await request.json()

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }), 
                { status: 404 }
            );
        }

        await connect()
        const user = await User.findById(userId);
        if(!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }), 
                { status: 400 }
            );
        }

        const NewCategory = new Categorias({
            title,
            users: new  ObjectId(userId),
        })

        console.log(NewCategory);

            await NewCategory.save();

            return new NextResponse(
                JSON.stringify({message : "A new Category is Created", NewCategory}),
                { status: 201 }
            );
    }catch(err : unknown){
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return new NextResponse("Error creating category: " + errorMessage  ,{status: 500})
    }
}