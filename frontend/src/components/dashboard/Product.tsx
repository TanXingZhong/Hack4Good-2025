import { Snackbar } from "@mui/material";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
} from "@mui/material";

import { createTransaction, fetchUserCart, updateTransaction } from "../../api/transaction";
import { useAuth } from "../../contexts/AuthContext";
import { ProductAmount } from "../pages/home";

interface ProductProps {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  quantity: number;
}

const Product: React.FC<ProductProps> = ({
  id,
  image,
  title,
  subtitle,
  price,
  description,
  quantity,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { auth } = useAuth();

  const toggleModal = () => setModalOpen(!modalOpen);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const displaySnackbar = (message : string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    console.log(message);
  }

  // close snackbar/toast
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }

  const handleAddToCart = async () => {
    toggleModal();

    const transaction = await fetchUserCart(auth.id);

    if (transaction === null) {
      await createTransaction({
        userId: auth.id,
        products: [{
          productId: id,
          amount: 1
        }],
        status: "cart"
      });
    } else {
      // product is in shopping cart
      if (transaction.products.find((product: ProductAmount) => product.productId === id)) {
        await updateTransaction(transaction._id, {
          products: [
            ...transaction.products.filter((product: ProductAmount) => product.productId !== id),
            {       
              productId: id,
              amount: transaction.products.find((product: ProductAmount) => product.productId === id).amount + 1
            }
          ],
          status: "cart"
        });
      } else {
        await updateTransaction(transaction._id, {
          products: [
            ...transaction.products,
            {       
              productId: id,
              amount: 1
            }
          ],
          status: "cart"
        });
      }
    }

    displaySnackbar("Product " + (quantity > 0 ? "added to cart" : "added to cart as a preorder"));
  }

  return (
    <>
      {/* Main Product Card */}
      <Card
        sx={{
          cursor: "pointer",
          border: "1px solid #eee",
          borderRadius: 2,
          boxShadow: 2,
          mb: 2,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: 3,
          },
        }}
        onClick={toggleModal}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", fontSize: "20px" }}
        >
          {title}
        </Typography>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{
            objectFit: "fit",
          }}
        />
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Price: {price}
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                color: quantity > 0 ? "green" : "red",
              }}
            >
              Quantity: {quantity > 0 ? quantity : "Out of stock"}
            </Typography>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "14px" }}
          >
            {subtitle}
          </Typography>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onClose={toggleModal} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CardMedia
              component="img"
              height="300"
              image={image}
              alt={title}
              sx={{
                objectFit: "fit",
                mb: 2,
                width: "100%",
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Price: {price}
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                color: quantity > 0 ? "green" : "red",
              }}
            >
              Quantity: {quantity > 0 ? quantity : "Out of stock"}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color={quantity > 0 ? "primary" : "secondary"}
            sx={{ width: "100%" }}
            onClick={handleAddToCart}
          >
            {quantity > 0 ? "Add to Cart" : "Preorder"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
};

export default Product;
