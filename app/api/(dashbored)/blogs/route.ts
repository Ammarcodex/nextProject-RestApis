import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server"
import mongoose from "mongoose";
import Categorias from "@/lib/modals/category";
import Blog from "@/lib/modals/blogs";

const { ObjectId } = mongoose.Types;


export const GET = async (request: Request) => {

    console.log("somewhere here...");

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const category = searchParams.get('category');
        const serachKeyWords = searchParams.get("keywords") as string
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")
        const page= parseInt(searchParams.get("page") || "1");
        const limit= parseInt(searchParams.get("limit") || "10");
        
        console.log(category);  



        if (!userId || !ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: `Missing userId parameter.` }), { status: 400 });
        }

        if (!category || !ObjectId.isValid(category)) {
            return new NextResponse(JSON.stringify({ message: `Missing category parameter.` }), { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: 'Uesr id not found' }), { status: 404 })
        }

        const categories = await Categorias.findById(category)
        if (!categories) {
            return new NextResponse(JSON.stringify({ message: 'Category id not found' }), { status: 404 })
        }

        

        interface BlogFilter {
            user: object;
            categorys: object;
            $or?: Array<{ title: { $regex: string; $options: string }; } | { description: { $regex: string; $options: string }; }>;
            createdAt?: { $gte: Date; $lte: Date } | { $gte: Date } | { $lte: Date };
        }
        
        const filter: BlogFilter = {
            user: new ObjectId(userId),
            categorys: new ObjectId(category)
        };
        
        if (serachKeyWords) {
            filter.$or = [
                { title: { $regex: serachKeyWords, $options: 'i' } },
                { description: { $regex: serachKeyWords, $options: 'i' } }
            ];
        }
        
        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            filter.createdAt = {
                $gte: new Date(startDate)
            };
        } else if (endDate) {
            filter.createdAt = {
                $lte: new Date(endDate)
            };
        }
        
        const skip = (page - 1) * limit;
        
        const blogs = await Blog.find(filter)
            .sort({ createdAt: 'asc' })
            .skip(skip)
            .limit(limit);
        console.log(filter)

        return new NextResponse(JSON.stringify({blogs}), { status: 200 });



    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(JSON.stringify({ message: `An error occurred finding Blog ${errorMessage}` }), { status: 404 });

    }
}

export const POST = async (request: Request) => {

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const categoryid = searchParams.get('category');
        const body = await request.json();

        const { title, description } = body

        if (!userId || !ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ messsage: "Missing or Invalid userid" }), { status: 404 });
        }

        if (!categoryid || !ObjectId.isValid(categoryid)) {
            return new NextResponse(JSON.stringify({ message: "Missing or invalid Category" }), { status: 404 });
        }

        await connect();

        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in db" }), { status: 404 });
        }

        const category = await Categorias.findById(categoryid)
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "category not found in db" }), { status: 404 });
        }

        console.log(categoryid);

        const some = {
            title,
            description,
            user: userId,
            categorys: categoryid,

        }
        console.log(some);
        const newBlogs = new Blog(some)
        await newBlogs.save()
        console.log(newBlogs);


        return new NextResponse(JSON.stringify({ message: `new blog has been saved ${newBlogs}` }), { status: 200 })



    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse("An Error Accued" + errorMessage, { status: 500 })

    }

}