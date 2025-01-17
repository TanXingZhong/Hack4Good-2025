import express from "express";
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getCartOfUser,
} from "../controllers/transactionController"; // Adjust the path as needed

const router = express.Router();

// Route to create a new transaction
router.post("/", createTransaction);

// Route to get all transactions
router.get("/", getTransactions);

// Route to get the current cart of the user
router.get("/cart/:userId", getCartOfUser);

// Route to get a transaction by ID
router.get("/:id", getTransactionById);

// Route to update a transaction by ID
router.put("/:id", updateTransaction);

// Route to delete a transaction by ID
router.delete("/:id", deleteTransaction);

export default router;
