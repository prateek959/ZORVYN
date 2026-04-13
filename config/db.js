import dns from "dns";

// 👇 ye 2 line sabse upar honi chahiye
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import "dotenv/config";

const db = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_PROD_URI);
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log(error);
    };
};

export default db;