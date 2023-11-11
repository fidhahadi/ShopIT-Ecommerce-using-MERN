import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async () => {
    try {
        await mongoose.connect("mongodb+srv://skillfidha:skillfidha@shopit.wzgdb7n.mongodb.net/shopit-v1?retryWrites=true&w=majority");

        await Product.deleteMany();
        console.log("Products are deleted");

        await Product.insertMany(products);
        console.log("Products are added");

        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
};

seedProducts();