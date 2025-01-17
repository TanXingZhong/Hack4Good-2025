import axios from "axios";

const USER_SERVICE_URL = "http://localhost:4000";

// Set up Axios instance with a base URL
const API = axios.create({
    baseURL: USER_SERVICE_URL + "/transactions", // Adjust base URL as per your backend
});

// Create a new transaction
export const createTransaction = async (transactionData: {
    userId: string;
    products: { productId: string; amount: number }[];
    status?: "cart" | "pending" | "approved" | "rejected";
}) => {
    const response = await API.post("/", transactionData);
    return response.data;
};

// Get all transactions
export const getTransactions = async () => {
    const response = await API.get("/");
    return response.data;
};

// Get a transaction by ID
export const getTransactionById = async (transactionId: string) => {
    const response = await API.get(`/${transactionId}`);
    return response.data;
};

// Update a transaction by ID
export const updateTransaction = async (
    transactionId: string,
    updatedData: {
        userId?: string;
        products?: { productId: string; amount: number }[];
        status?: "cart" | "pending" | "approved" | "rejected";
    }
) => {
    const response = await API.put(`/${transactionId}`, updatedData);
    return response.data;
};

// Delete a transaction by ID
export const deleteTransaction = async (transactionId: string) => {
    const response = await API.delete(`/${transactionId}`);
    return response.data;
};

// Fetch cart of certain user
export const fetchUserCart = async (userId: string) => {
    try {
        const response = await API.get(`/cart/${userId}`);
        console.log("User Cart:", response.data);
        return response.data;
    } catch (error : any) {
        return null;
    }
};

export default {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    fetchUserCart
};