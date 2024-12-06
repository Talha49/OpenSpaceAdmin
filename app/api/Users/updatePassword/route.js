import dbConnect from "@/lib/connectdb/connection"; // Database connection
import nodemailer from "nodemailer"; // Nodemailer for sending emails
import bcrypt from "bcryptjs"; // bcryptjs for hashing passwords
import User from "@/lib/models/User"; // User model

// API route handler for updating password
export async function POST(req) {
    try {
        const { userId, newPassword } = await req.json(); // Use req.json() to parse the incoming request body

        // Check if newPassword is provided and is a string
        if (!newPassword || typeof newPassword !== 'string') {
            return new Response(JSON.stringify({ message: "Invalid or missing password." }), { status: 400 });
        }

        // Connect to the database
        await dbConnect();
     // Save the plain text password temporarily (for email)
     const plainTextPassword = newPassword;

        // Generate a hashed password using bcrypt
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Find the user by userId and update the password
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // Send email notification to the user about the password change
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: updatedUser.email,
            subject: "Your password has been updated",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <!-- Header Section -->
                    <div style="background-color: #007bff; padding: 20px; text-align: center;">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_gYQAwOklEatAbHEPKC0vnPwJqOW4INa1e8N5yeie3TmY1iS2CkLtBJJSfyymzXcUKA&amp;usqp=CAU" 
                             alt="Company Logo" style="max-width: 150px; margin-bottom: 10px;">
                        <h1 style="color: white; font-size: 24px; margin: 0;">Details Updated</h1>
                    </div>
        
                    <!-- Content Section -->
                    <div style="padding: 20px;">
                        <p style="font-size: 16px; margin: 0;">Dear <b>${updatedUser.fullName}</b>,</p>
                        <p style="font-size: 14px; color: #555;">Your account details have been successfully updated by the Admin.</p>
                        <p style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">Here are your updated login details:</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                                <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd;">${updatedUser.email}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd; font-weight: bold;">New Password:</td>
                                <td style="font-size: 14px; color: #555; padding: 8px; border: 1px solid #ddd;">${plainTextPassword}</td>
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

        // Return a success response
        return new Response(JSON.stringify({ message: "Password updated and email sent" }), { status: 200 });
    } catch (error) {
        console.error("Error updating password or sending email:", error);
        return new Response(JSON.stringify({ message: "An error occurred. Please try again later." }), { status: 500 });
    }
}
