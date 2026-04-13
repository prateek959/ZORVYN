import Finance from "../models/FinancialRecord.model.js";


const createFinancial = async (req, res) => {
    try {
        let { amount, type, category, note } = req.body;

        if (!amount || !type) {
            return res.status(400).json({ message: "Fields are Required" });
        }

        category = category || "";
        note = note || "";

        await Finance.create({
            userId: req.user.userId,
            amount,
            type,
            category,
            note
        });

        res.status(201).json({ message: "Records Created Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const getRecords = async (req, res) => {
    try {
        let query;

        if (req.user.role === "admin") {
            query = {};
        } else {
            query = { userId: req.user.userId };
        }

        const records = await Finance.find(query).sort({ date: -1 });

        if (records.length === 0) {
            return res.status(200).json({ message: "No Records Found" });
        }

        res.status(200).json({ records });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updateRecords = async (req, res) => {
    try {
        const recordsID = req.params.recordID;

        const { amount, type, category, note } = req.body;

        const record = await Finance.findById(recordsID);

        if (!record) {
            return res.status(400).json({ message: "Record Not Found" });
        };

        if (req.user.role === "analyst" && record.userId.toString() !== req.user.userId) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }


        if (amount) {
            record.amount = amount;
        };

        if (type) {
            record.type = type;
        };

        if (category) {
            record.category = category;
        };

        if (note) {
            record.note = note;
        };

        await record.save();

        res.status(200).json({ message: "Records Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const deleteRecords = async (req, res) => {
    try {
        const recordsID = req.params.recordID;

        const record = await Finance.findById(recordsID);

        if (!record) {
            return res.status(400).json({ message: "Record Not Found" });
        };

        await record.deleteOne();
        res.status(200).json({ message: "Records Deleted Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export { createFinancial, getRecords, updateRecords, deleteRecords };