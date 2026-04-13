import Finance from "../models/FinancialRecord.model.js";

const getAnalytics = async (req, res) => {
    try {

        let query;

        if (req.user.role === "admin") {
            query = {};
        } 
        else {
            query = { userId: req.user.userId };
        }

        const records = await Finance
            .find(query)
            .sort({ date: -1 });

        let analytics = {
            totalIncome: 0,
            totalExpense: 0,
            netBalance: 0,
            categoryWise: {},
            recentTransactions: []
        };

        if (records.length === 0) {
            return res.status(200).json({ analytics });
        }

        for (let i = 0; i < records.length; i++) {
            let record = records[i];

            if (record.type === "income") {
                analytics.totalIncome += record.amount;
            }

            if (record.type === "expense") {
                analytics.totalExpense += record.amount;

                if (record.category) {
                    if (analytics.categoryWise[record.category]) {
                        analytics.categoryWise[record.category] += record.amount;
                    } else {
                        analytics.categoryWise[record.category] = record.amount;
                    }
                }
            }
        }

        analytics.netBalance = analytics.totalIncome - analytics.totalExpense;

        analytics.recentTransactions = records.slice(0, 5);

        return res.status(200).json(analytics);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default getAnalytics;