import { Schema, models, model } from "mongoose";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const BlogSchema = new Schema(
    {
        title: { type: "string", required: true },
        description: { type: "string" },
        user: { type: ObjectId, ref: "User" },
        categorys: { type: ObjectId, ref: "Categorias" }

        
       
    },
    {
        timestamps: true,
    }
);

const Blog = models.Blog || model("Blog", BlogSchema);
export default Blog;

