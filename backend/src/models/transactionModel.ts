import mongoose, { Document, Mongoose } from "mongoose";

interface ITransactionProduct {
    productId: mongoose.Types.ObjectId;
    amount: number;
}

interface ITransaction extends Document {
    userId: string;
    products: ITransactionProduct[];
    status: "cart" | "pending" | "approved" | "rejected";
    createdAt: Date;
}

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
            },
        ],
        status: {
            type: String,
            enum: ["cart", "pending", "approved", "rejected"],
            default: "pending", // Default status
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
export { transactionSchema, ITransaction, ITransactionProduct };
export default Transaction;