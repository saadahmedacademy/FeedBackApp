import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    const { username, email, password } = await request.json();

    // Check if username is already taken by a verified user
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Username is already taken',
        }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    let newUser = null;

    if (existingUserByEmail) {
      try {
        // Update existing user
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
        newUser = existingUserByEmail; // Assign updated user to newUser
      } catch (error) {
        console.error('Error updating existing user:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Error updating user',
          }),
          { status: 500 }
        );
      }
    } else {
      try {
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        newUser = await UserModel.create({
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          isAcceptingMessages: true,
          messages: [],
        });

        if (!newUser) {
          console.error('Error creating new user:', newUser);
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Error creating user',
            }),
            { status: 500 }
          );
        }

        console.log('New user created:', newUser);
      } catch (error) {
        console.error('Error creating new user:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Error creating user',
          }),
          { status: 500 }
        );
      }
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully. Please verify your account.',
        user: newUser, // Return the user data
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error registering user',
      }),
      { status: 500 }
    );
  }
}
