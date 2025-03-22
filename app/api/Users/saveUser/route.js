import dbConnect from "@/lib/connectdb/connection";
import User from "@/lib/models/User";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

// Generate random password
const generateRandomPassword = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Send email with login details
const sendEmail = async (email, password, fullName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your New Account Login Details",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="background-color: #007bff; padding: 20px; text-align: center;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_gYQAwOklEatAbHEPKC0vnPwJqOW4INa1e8N5yeie3TmY1iS2CkLtBJJSfyymzXcUKA&amp;usqp=CAU" class="sFlh5c FyHeAf" alt="Company Logo" style="max-width: 150px; margin-bottom: 10px;">
          <h1 style="color: white; font-size: 24px; margin: 0;">Welcome to Our Platform!</h1>
        </div>

        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px; margin: 0;">Dear <b>${fullName}</b>,</p>
          <p style="font-size: 14px; color: #555;">Your account has been successfully created by the Admin.</p>
          <p style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">Here are your login details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd; font-weight: bold;">Password:</td>
              <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd;">${password}</td>
            </tr>
          </table>
          <p style="font-size: 14px; color: #555; margin-top: 20px;">We recommend resetting your password after logging in for security purposes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://yourwebsite.com/login" 
               style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
               Log In to Your Account
            </a>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #777;">
          <p style="margin: 0;">If you have any questions, feel free to contact our support team at <a href="mailto:support@yourcompany.com" style="color: #007bff;">support@yourcompany.com</a>.</p>
          <p style="margin: 0;">&copy; 2024 YourCompany. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// Main API handler
export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request data
    const data = await request.json();
    // console.log("📦 Received data:", data);

    // Generate a random password and hash it
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Default fullName to "User" if it's not provided
    const fullName = data.fullName || "User";

    // Check if the user already exists with the provided email
    const existing = await User.find({ email: data.email });
    // console.log("Existing user: ", existing);

    // If the user already exists, return an error
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Create a new user object
    const newUser = new User({
      id: uuidv4(), // Ensure uuidv4 is correctly imported
      fullName,
      email: data.email,
      address: data.address,
      city: data.city,
      country: data.country,
      contact: data.contact,
      status: data.createdByAdmin ? "active" : "pending",
      createdByAdmin: data.createdByAdmin || false,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();
    // console.log("✅ User saved to database:", newUser);

    // Send the email to the user with their generated password
    await sendEmail(data.email, randomPassword, fullName);
    // console.log(`📧 Email sent to ${data.email}`);

    // Return success response
    return NextResponse.json({
      message: "User saved successfully",
      user: newUser,
    });
  } catch (error) {
    // console.error("❌ Error handling request:", error);

    // Return error response in case of failure
    return NextResponse.json(
      { error: "Error handling request" },
      { status: 500 }
    );
  }
}
