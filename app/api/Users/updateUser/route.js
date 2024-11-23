import dbConnect from "@/lib/connectdb/connection";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"; // For hashing passwords
import User from "@/lib/models/User"; // Assuming you have a User model

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, address, city, profileImage, password } = body;

    // Connect to the database
    await dbConnect();

    // Generate hashed password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Update user details in the database
    const updatedFields = {
      fullName,
      address,
      city,
      profileImage,
      ...(hashedPassword && { password: hashedPassword }), // Only update the password if provided
    };

    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find the user by email
      updatedFields,
      { new: true }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404 }
      );
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Replace with your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Account Login Details Updated',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <!-- Header Section -->
          <div style="background-color: #007bff; padding: 20px; text-align: center;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_gYQAwOklEatAbHEPKC0vnPwJqOW4INa1e8N5yeie3TmY1iS2CkLtBJJSfyymzXcUKA&amp;usqp=CAU" class="sFlh5c FyHeAf" alt="Company Logo" style="max-width: 150px; margin-bottom: 10px;">
            <h1 style="color: white; font-size: 24px; margin: 0;">Details Updated</h1>
          </div>
  
          <!-- Content Section -->
          <div style="padding: 20px;">
            <p style="font-size: 16px; margin: 0;">Dear <b>${fullName}</b>,</p>
            <p style="font-size: 14px; color: #555;">Your account Deatils has been successfully updated by the Admin.</p>
            <p style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">Here are your updated login details:</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd; font-weight: bold;">New Password:</td>
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
  
    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "User updated and email sent successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user or sending email:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred. Please try again later." }),
      { status: 500 }
    );
  }
}
