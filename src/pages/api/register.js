import dbConnect from "../../../utiles/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
export default async function handler(req, res) {
    try {
        if (req.method === "POST") {
            await dbConnect();
            const { password, email, userName } = req.body;
            if (!email || !password || !userName) {
                return res.status(400).json({ message: "data is needed" });
            }
            if (await User.findOne({ email: email })) {
                return res
                    .status(400)
                    .json({ message: "this email already exists" });
            }
            let hashedPassword = await bcrypt.hash(password, 10);
            let user = new User({
                email: email,
                password: hashedPassword,
                userName: userName,
            });
            user = await user.save();
            res.status(200).json({
                message: "you have been registered successfully",
            });
        } else {
            return res.status(404).json({ message: "not found route" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "an error occurred" });
    }
}
