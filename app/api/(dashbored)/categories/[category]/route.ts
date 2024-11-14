import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server"
import mongoose from "mongoose";
import Categorias from "@/lib/modals/category";


const { ObjectId } = mongoose.Types;


export const PATCH = async (request: Request, context: { params: any }) => {
    const { category: categoryId } = await context.params;

    console.log(categoryId);
    try {
        const body = await request.json();
        const { title } = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

      
        if (!userId || !ObjectId.isValid(userId)) {
            return new NextResponse("Invalid or missing userId", { status: 400 });
        }
        if (!categoryId || !ObjectId.isValid(categoryId)) {
            return new NextResponse("Invalid or missing categoryId", { status: 400 });
        }

        await connect();

       
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

      
        const category = await Categorias.findOne({ _id: categoryId, users: userId });
        console.log(category)
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
        }

       
        const updatedCategory = await Categorias.findByIdAndUpdate(categoryId, { title }, { new: true });

        return new NextResponse(JSON.stringify({ message: "Category is updated", category: updatedCategory }), { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Error in updating category: ${errorMessage}`, { status: 500 });
    }
};

export const DELETE = async (request : Request , context : { params : any}) => {
    const { category: categoryId } = await context.params;

    try{
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if(!userId || !ObjectId.isValid(userId)){
            return new NextResponse("Invalid or missing userId", { status: 400 });
        }

       if(!categoryId || !ObjectId.isValid(categoryId)){
         return new NextResponse("Invalid or missing categoryId", { status: 400 });
       } 


       await connect();

       const category = await Categorias.findOne({ _id: categoryId, users: userId });
       console.log(category)
       if (!category) {
           return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
       }

    const deleted = await Categorias.findByIdAndDelete(categoryId);


       return new NextResponse(JSON.stringify({ message:`Category has been deleted ${deleted}` }), { status: 200 });

    }catch (error : unknown){
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Error in deleting category: ${errorMessage});`, { status: 500 });

    }


}