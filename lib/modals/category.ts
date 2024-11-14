import { Schema , model , models } from "mongoose";
import  mongoose  from "mongoose";

const { ObjectId } = mongoose.Types;

const CategoriSchema = new Schema(
    {
        title : {type: "string", required: true},
        users : {type: ObjectId, ref:"User"},
    },
    {
        timestamps: true,
    }
)

const Categorias = models.Categorias || model("Categorias", CategoriSchema);

export default Categorias;