export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            let products = await (await fetch("https://dummyjson.com/products")).json()
            res.status(200).json(products);
        } else {
            return res.status(404).json({ message: "not found route" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "an error occurred" });
    }
}
