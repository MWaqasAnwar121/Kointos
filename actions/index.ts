"use server"
import User from "@/models/User.model";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Article from "@/models/Article.model"
import ArticlesPage from "@/app/articles/page";

export const CreateNewUser = async (formData: {
    username: string,
    email: string,
    password: string
}) => {
    await dbConnect();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
        return { success: false, message: "All fields are required" }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { success: false, message: "User already exists" }
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    
    // Convert Mongoose document to plain object
    const userPlainObject = user.toObject()
    delete userPlainObject.password
    userPlainObject._id = userPlainObject._id.toString() // Explicitly convert _id to string

    return { success: true, message: "User created successfully", user: userPlainObject }
}

export const LoginUser = async (formData: {
    email: string,
    password: string
}) => {
    try {
        await dbConnect()
        const { email, password } = formData

        if (!email || !password) {
            return { success: false, message: "All fields are required" }
        }

        const existingUser = await User.findOne({ email }).select('+password')
        if (!existingUser) {
            return { success: false, message: "Account Not Exists" }
        }

        if (!existingUser.password) {
            return { success: false, message: "Invalid user data" }
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password)
        if (!comparePassword) {
            return { success: false, message: "Password doesn't match" }
        }

        // Convert Mongoose document to plain object and remove password
        const userPlainObject = existingUser.toObject()
        delete userPlainObject.password
        userPlainObject._id = userPlainObject._id.toString() // Explicitly convert _id to string

        return { success: true, message: "User loggedin successfully", user: userPlainObject }
    } catch (error) {
        console.error('Login error:', error)
        return { success: false, message: "An error occurred during login" }
    }
}

export const CreateNewArticle = async (formData: {
    userId: string,
    title: string,
    content: string,
    authorName: string
}) => {
    const { userId, title, content, authorName } = formData;
    console.log(formData)

    const newArticle = new Article({
        userId, title, content, authorName
    })
    await newArticle.save()

    // Convert Mongoose document to plain object
    const plainArticle = newArticle.toObject()

    // Explicitly convert _id and userId to strings
    plainArticle._id = plainArticle._id.toString()
    plainArticle.userId = plainArticle.userId.toString()

    return { success: true, message: "Your article has been saved successfuly", article: plainArticle }
}

export const FetchAllArticles = async () => {
    const articles = await Article.find({}).lean()

    if (articles.length < 1) {
        return { success: false, message: "No article found" }
    }

    // Explicitly map to plain objects matching the client-side interface
    const plainArticles = articles.map((article: any) => ({
        _id: article._id.toString(),
        title: article.title,
        content: article.content,
        userId: article.userId.toString(),
        authorName: article.authorName,
        createdAt: article.createdAt.toISOString(), // Convert Date to ISO string
        updatedAt: article.updatedAt.toISOString(), // Convert Date to ISO string
    }));

    return { success: true, message: "Articles fetched successfully", articles: plainArticles }
}

export const FetchArticleById = async (formData: {
    articleId: string
}) => {
    const { articleId } = formData;
    const article = await Article.findById( articleId ).lean()

    if (!article) {
        return { success: false, message: "No article found" }
    }

    // .lean() already returns a plain object, no need for .toObject()
    return { success: true, message: "Article found", article: article }
}

export const UpdateArticleById = async (formData: {
    articleId: string,
    title: string,
    content: string,
    authorName: string
}) => {
    const { articleId, title, content, authorName } = formData;

    const article = await Article.findOneAndUpdate({ _id:articleId }, {
        $set: {
            title: title,
            content: content,
            authorName: authorName
        }
    }, { new: true })

    // Check if article was found and updated, then convert to plain object
    if (!article) {
        return { success: false, message: "Article not found" }
    }
    const plainArticle = article.toObject();

    return { success: true, message: "Article updated successfuly", article: plainArticle }

}


export const DeleteArticleById = async (formData:{
    articleId:string 
}) => {
    const {articleId} = formData;

    await Article.findByIdAndDelete(articleId)

    return {success:true, message:"Article deleted successfuly"}

}