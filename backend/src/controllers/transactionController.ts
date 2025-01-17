import { Request, Response } from "express";
import Transaction from "../models/transactionModel"; // Adjust the path as needed

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { userId, products, status="cart" } = req.body;

        if (!userId || !products || !Array.isArray(products)) {
            res.status(400).json({ message: "Invalid input data" });
            return;
        }

        const transaction = new Transaction({ userId, products, status });
        await transaction.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all transactions
export const getTransactions = async (_req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find().populate("products.productId");
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a single transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findById(id).populate("products.productId");
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update a transaction by ID
export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, products, status } = req.body;

        console.log(req.params);
        console.log(req.body);

        const transaction = await Transaction.findByIdAndUpdate(
            id,
            { userId, products, status },
            { new: true, runValidators: true }
        );

        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a transaction by ID
export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findByIdAndDelete(id);
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get current cart of user
export const getCartOfUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const transaction = await Transaction.findOne({
            userId,
            status: "cart"
        });
        if (!transaction) {
            res.status(404).json({ message: "No cart found for this user" });
            return;
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};