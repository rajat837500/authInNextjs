// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/hash";

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || "USER",
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}



// import { connectDB } from '@/lib/db';
// import User from '@/models/User';
// import { hashPassword } from '@/lib/hash';

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { username, password, role } = await req.json();

//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
//     }

//     const hashed = await hashPassword(password);
//     const newUser = new User({ username, password: hashed, role });
//     await newUser.save();

//     return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }
