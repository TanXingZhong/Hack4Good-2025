// External libraries
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

// Internal libraries
import Product from "../models/productModel";

/**
 * Retrieves all products in the database.
 * 
 * Endpoint: GET /products  
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * 
 * @returns {Promise<Response>} - Returns a JSON response with an array of all product data, 
 * or an error message if a server error occurs.
 * 
 * Expected HTTP Status Codes:
 * - 200: Users found and data returned.
 * - 500: Unknown server error.
 */
export async function getAllProducts(req: Request, res: Response) {
    try {
      // Fetch all product documents from the database
      const products = await Product.find();
  
      res.status(200).json({ message: `Found products`, data: products });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unknown error when getting all products!", data: [] });
      return;
    }
}

/**
 * Retrieves a product by their ID.
 * 
 * Endpoint: GET /products/:id
 * 
 * @param {Request} req - The request object containing `id` as a URL parameter.
 * @param {Response} res - The response object.
 * 
 * @returns {Promise<Response>} - Returns a JSON response with the product data if found, 
 * or an error message if the product is not found or other errors occur.
 * 
 * Workflow:
 * 1. Validates the format of `productID`.
 * 2. Searches for the product by ID in the database.
 * 3. Returns the product data if found.
 * 
 * Expected HTTP Status Codes:
 * - 200: Product found and data returned.
 * - 404: Product not found (either due to invalid ID format or nonexistent product).
 * - 500: Unknown server error.
 */
export async function getProduct(req: Request, res: Response) {
    try {
      // Extract productID from request parameters
      const productID = req.params.id;
  
      // Validate productID format to ensure it's a valid MongoDB ObjectId
      if (!isValidObjectId(productID)) {
        res.status(404).json({ message: `Product ${productID} not found` });
        return;
      }
  
      // Attempt to find the product in the database by ID
      const product = await Product.findById(productID);
  
      // Check if the product exists
      if (!product) {
        res.status(404).json({ message: `Product ${productID} not found` });
        return;
      } else {
        res.status(200).json({ message: `Found product`, data: product });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unknown error when getting product!" });
      return;
    }
}

/**
 * Creates a new prodcut.
 * 
 * Endpoint: POST /products
 * 
 * @param {Request} req - The request object containing `name`, `description`, `price` and `countInStock` in the body.
 * @param {Response} res - The response object.
 * 
 * @returns {Promise<Response>} - Returns a JSON response with user data if creation is successful, 
 * or an error message if there are validation errors or other issues.
 * 
 * Workflow:
 * 1. Validates price and countInStock format. 
 * 2. Checks if the name is already taken.
 * 3. Creates and saves the new product.
 * 
 * Expected HTTP Status Codes:
 * - 201: Product created successfully.
 * - 400: Validation errors (e.g., invalid price/countInStock).
 * - 500: Unknown server error.
 */
export async function createProduct(req: Request, res: Response) {
    try {
        const { name, description, price, countInStock, imageUrl } = req.body;

        // Validate and parse `price`
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            res.status(400).json({ message: "Invalid price. It must be a positive number." });
            return;
        }

        // Validate and parse `countInStock`
        const parsedStockCount = parseInt(countInStock, 10);
        if (isNaN(parsedStockCount) || parsedStockCount < 0) {
            res.status(400).json({ message: "Invalid stock count. It must be a positive integer." });
            return;
        }

        // Check if a product with the same name already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            res.status(400).json({ message: "Product with this name already exists" });
            return;
        }

        const newProduct = new Product({
            name,
            description,
            price,
            countInStock,
            imageUrl,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", data: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unknown error occurred in the server!" });
    }
}

/**
 * Allows admins to update a product's information, including name, description, price, countInStock, and imageUrl.
 * 
 * Endpoint: PATCH /products/update
 * 
 * @param {Request} req - The request object containing:
 *   - `id` (required): The ID of the product to update.
 *   - `name` (optional): New name of the product.
 *   - `description` (optional): New description of the product.
 *   - `price` (optional): New price of the product (must be a positive number).
 *   - `countInStock` (optional): New stock count (must be a non-negative integer).
 *   - `imageUrl` (optional): New image URL for the product.
 * @param {Response} res - The response object.
 * 
 * @returns {Promise<Response>} - Returns a JSON response with updated product data if successful,
 * or an error message if the update fails due to validation issues, product not found, or a server error.
 * 
 * Workflow:
 * 1. Retrieves the product by `id` from the request body.
 * 2. Validates optional fields (`price` must be a positive number, `countInStock` must be a non-negative integer).
 * 3. Updates the product's `name`, `description`, `price`, `countInStock`, and/or `imageUrl` as necessary.
 * 4. Saves the updated product data.
 * 5. Returns the updated product in the response.
 * 
 * Expected HTTP Status Codes:
 * - 200: Product updated successfully.
 * - 400: Validation error, such as missing or invalid fields.
 * - 404: Product not found.
 * - 500: Server error.
 */
export async function updateProduct(req: Request, res: Response) {
    try {
        const { id, name, description, price, countInStock, imageUrl } = req.body; 

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        // Validate and parse `price`
        if (price !== undefined) {
            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice < 0) {
                res.status(400).json({ message: "Invalid price. It must be a positive number." });
                return;
            }
            product.price = parsedPrice;
        }

        // Validate and parse `countInStock`
        if (countInStock !== undefined) {
            const parsedStockCount = parseInt(countInStock, 10);
            if (isNaN(parsedStockCount) || parsedStockCount < 0) {
                res.status(400).json({ message: "Invalid stock count. It must be a positive integer." });
                return;
            }
            product.countInStock = parsedStockCount;
        }

        // Update other fields if provided
        product.name = name || product.name;
        product.description = description || product.description;
        product.imageUrl = imageUrl || product.imageUrl;

        // Save the updated product
        const updatedProduct = await product.save();

        res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Unknown error occurred while updating product" });
    }
}

export async function deleteProduct(req: Request, res: Response) {
    try {
      const productId = req.params.id;
  
      // Validate productId format to ensure it's a valid MongoDB ObjectId
      if (!isValidObjectId(productId)) {
        res.status(404).json({ message: `Product ID ${productId} invalid` });
        return;
      }
  
      // Retrieve product using product ID from database
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({ message: `Product ${productId} not found` });
        return;
      }
  
      // Delete the product if found
      await Product.findByIdAndDelete(productId);
      res.status(200).json({ message: `Deleted product ${productId} successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unknown error when deleting product!" });
    }
  }
