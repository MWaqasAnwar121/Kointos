import mongoose, { trusted } from "mongoose"

const articleSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        requried: true
    },
    authorName: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema)
export default Article;