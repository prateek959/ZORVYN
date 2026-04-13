import Finance from "../models/FinancialRecord.model.js";

const Filter = async (req, res) => {
    try {
        let { type, search, page = 1, limit = 5 } = req.query;

        page = Number(page);
        limit = Number(limit);

        let query;

        if (req.user.role === "admin") {
            query = {};
        } else {
            query = { userId: req.user.userId };
        }

        if (type) {
            query.type = type;
        }

        if (search) {
            query.category = search;
        }

        const records = await Finance.find(query)
            .sort({ date: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        if (records.length === 0) {
            return res.status(200).json({ message: "No Records Found" });
        }

        res.status(200).json({ records });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default Filter;