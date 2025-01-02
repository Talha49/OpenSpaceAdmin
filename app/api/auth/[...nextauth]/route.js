import NextAuth from "next-auth"; // This import works fine for CommonJS with ESM interop

// Correctly extract the default export if required
const NextAuthFunction = NextAuth.default || NextAuth;

export const authOptions = {
  providers: [], // Add your providers here
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();

        const existingUser = await User.findOne({ email: user.email });
        let userData;

        // Check if login is via a social provider (Google or Facebook)
        const isSocialLogin =
          account.provider !== "login" && account.provider !== "register"; // CredentialsProvider has id "login"

        if (existingUser) {
          existingUser.fullName = user.name || existingUser.fullName;
          existingUser.image = user.image || existingUser.image;

          // Update isSocialLogin only for social logins
          if (isSocialLogin) {
            existingUser.isSocialLogin = true;
          }

          const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          existingUser.token = token;
          await existingUser.save();
          const userWithRole = await User.findById(existingUser?._id)
            .populate("role")
            .exec();
          userData = userWithRole;
        } else {
          const newUser = new User({
            fullName: user.name,
            email: user.email,
            image: user.image,
            isSocialLogin, // Set true if social login, false for credentials
          });
          const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          newUser.token = token;
          await newUser.save();
          const userWithRole = await User.findById(existingUser?._id)
            .populate("role")
            .exec();
          userData = userWithRole;
        }

        // Pass some data to the client-side via the token
        user.userData = userData;

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      if (user) {
        token.id = user.id;
        token.userData = user.userData;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.id = token.sub;
        session.user.userData = token.userData;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuthFunction(authOptions);
export { handler as GET, handler as POST };
