import User from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
        console.log(req.json())
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        return NextResponse.json({ message: "User created successfully", user:newUser }, { status: 201 })

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}