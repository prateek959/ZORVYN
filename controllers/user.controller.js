import User from "../models/user.model.js";


const getUser = async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length === 0) {
            return res.status(200).json({ message: "No Users Found" });
        };

        res.status(200).json({users});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: "Role is required" });
        }

        const validRoles = ["admin", "analyst", "viewer"];

        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid Role" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: "User Role Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "isActive must be true or false" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        user.isActive = isActive;
        await user.save();

        res.status(200).json({ message: "User Status Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export {getUser, updateUserRole, updateUserStatus};