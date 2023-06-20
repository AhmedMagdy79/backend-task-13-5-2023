import NextAuth from "next-auth";
import dbConnect from "../../../../utiles/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    await dbConnect();
                    const user = await User.findOne({
                        email: credentials.email,
                    });
                    if (!user) {
                        return null;
                    }
                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (!isValidPassword) {
                        throw new Error("Invalid email or password");
                    }
                    return { id: user.id, email: user.email };
                } catch (err) {
                    throw new Error();
                }
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async signIn(data) {
            try {
                const userData = data.profile;
                await dbConnect();
                const user = await User.findOne({
                    email: userData.email,
                });
                if (user) {
                    return { id: user._id, email: user.email };
                }
                const newUser = new User({
                    userName: userData.login,
                    email: userData.email,
                });
                await newUser.save();
                return newUser;
            } catch (err) {
                console.log(err);
                throw new Error();
            }
        },
    },
    secret: process.env.JWT_SECRET,
    session: {
        strategy: "jwt",
    },
});
