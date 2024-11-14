import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server"
import mongoose from "mongoose";
import Blog from "@/lib/modals/blogs";

const { ObjectId } = mongoose.Types;




export const PATCH = async (request: Request, context: { params: any }) => {
    const { blog: BlogId } = await context.params

    try {

        const body = await request.json();
        const { title, description } = body

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId");




        console.log(BlogId, "an blog id");

        if (!userId || !ObjectId.isValid(userId)) {

            return new NextResponse("Missing or invalid userId", { status: 404 });
        }

        if (!BlogId || !ObjectId.isValid(BlogId)) {
            return new NextResponse("Missing or invalid BlogId", { status: 404 });
        }

        await connect()

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse("Error Finding UserId", { status: 404 });
        }

        const Blogs = await Blog.findById(BlogId);
        if (!Blogs) {
            return new NextResponse("Error Finding BlogId", { status: 404 });
        }

        const blog = await Blog.findOne({ _id: BlogId, user: userId });

        if (!blog) {
            return new NextResponse("Cannot find the blog", { status: 404 });
        }

        const UpdateBlog = await Blog.findByIdAndUpdate(BlogId, { title, description }, { new: true });

        return new NextResponse(JSON.stringify("Blogs has been Updated : " + UpdateBlog), { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse("Error Updating the blogs : " + errorMessage, { status: 500 });

    }

}

export const DELETE = async (request: Request, context: { params: any }) => {
    const { blog: BlogId } =await context.params;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !ObjectId.isValid(userId)) {
            return new NextResponse("Invalid or missing userId", { status: 404 });
        }

        if (!BlogId || !ObjectId.isValid(BlogId)) {
            return new NextResponse("Invalid or missing BlogId", { status: 404 });
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse("userId not found in the db", { status: 404 });
        }

        const Blogs = await Blog.findById(BlogId);
        if (!Blogs) {
            return new NextResponse("Blogid not found in the db", { status: 404 });
        }

        const findBlog = await Blog.findOne({ _id: BlogId, user: userId })

        if (!findBlog) {
            return new NextResponse("Cannot find your blog in db");
        }

        const del = await Blog.findByIdAndDelete(BlogId);

        return new NextResponse(JSON.stringify({ message: `Your Blog has been deleted with ${del}` }), { status: 200 });


    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse("An Error Accured : " + errorMessage, { status: 500 });


    }


}
