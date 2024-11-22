import dbConnect from '@/lib/connectdb/connection';
import User from '@/lib/models/User';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

// Generate random password
const generateRandomPassword = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let password = '';
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
    subject: 'Your New Account Login Details',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #007bff;">Welcome to Our Platform!</h2>
        <p>Dear <b>${fullName}</b>,</p>
        <p>Your account has been successfully created by the Admin.</p>
        <p><b>Here are your login details:</b></p>
        <ul>
          <li><b>Email:</b> ${email}</li>
          <li><b>Password:</b> ${password}</li>
        </ul>
        <p>We recommend resetting your password after logging in for security purposes.</p>
        <a href="https://yourwebsite.com/login" style="background-color: #007bff; color: white; padding: 10px; text-decoration: none; border-radius: 5px;">Log In to Your Account</a>
      </div>
    `,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Main API handler
export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();
    console.log('📦 Received data:', data);

    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const fullName = data.fullName || 'User'; // Default to "User" if fullName is missing

    const newUser = new User({
      id: uuidv4(),
      fullName,
      email: data.email,
      address: data.address,
      city: data.city,
      contact: data.contact,
      status: data.createdByAdmin ? 'active' : 'pending',
      createdByAdmin: data.createdByAdmin || false,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('✅ User saved to database:', newUser);

    await sendEmail(data.email, randomPassword, fullName);
    console.log(`📧 Email sent to ${data.email}`);

    return NextResponse.json({ message: 'User saved successfully', user: newUser });
  } catch (error) {
    console.error('❌ Error handling request:', error);
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}
