import React, { Profiler, useEffect, useState } from "react";
import {
  Box,
  Grid2,
  Typography,
  Button,
  TextField,
  Paper,
  Checkbox,
  Card,
  IconButton,
  Divider,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../contexts/AuthContext";
import { createTransaction, fetchUserCart, updateTransaction } from "../../api/transaction";
import { getProduct, updateProduct } from "../../api/product";
import { getUserById, updateAccount } from "../../api/user";

interface CartItem {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  price: number;
  quantity: number;
  selected: boolean;
}

interface CartItemProps {
  item: CartItem;
  onUpdate: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onUpdate,
  onDelete,
  onSelect,
}) => {
  return (
    <Paper elevation={2} style={{ padding: "16px", marginBottom: "16px" }}>
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 size={{ xs: 0.5 }}>
          <Checkbox
            checked={item.selected}
            onChange={() => onSelect(item.id)}
          />
        </Grid2>
        <Grid2 size={{ xs: 4 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <img
              src={item.photoUrl}
              alt={`${item.name}'s submission`}
              style={{ width: 80, height: 80 }}
            />
            <Grid2
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                {item.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {item.description}
              </Typography>
            </Grid2>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1" color="primary">
            {item.price.toFixed(2)} points
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <Grid2 style={{ maxWidth: "70px" }}>
            <TextField
              type="number"
              size="small"
              value={item.quantity}
              onChange={(e) => onUpdate(item.id, parseInt(e.target.value) || 1)}
              fullWidth
            />
          </Grid2>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1" color="primary">
            {(item.price * item.quantity).toFixed(2)} points
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 1 }}>
          <IconButton onClick={() => onDelete(item.id)}>
            <DeleteIcon />
          </IconButton>
        </Grid2>
      </Grid2>
    </Paper>
  );
};

export type ProductAmount = {
  productId: string,
  amount: number
};

const Home: React.FC = () => {
  const { auth } = useAuth();

  const [productList, setProductList] = useState<ProductAmount[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "SKIN1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum",
      description: "SPF50+ PA++++",
      photoUrl:
        "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350",
      price: 15.99,
      quantity: 1,
      selected: false,
    },
    {
      id: "2",
      name: "COSRX Low pH Good Morning Gel Cleanser",
      description: "150ml",
      photoUrl:
        "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350",
      price: 8.0,
      quantity: 1,
      selected: false,
    },
  ]);

  const handleUpdate = (id: string, quantity: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleDelete = async (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));

    const userId = auth.id;
    const transaction = await fetchUserCart(userId);

    if (transaction !== null) {
      await updateTransaction(transaction._id, {
        products: transaction.products.filter((item: ProductAmount) => item.productId !== id),
        status: "cart"
      });
    }
  };

  const handleSelect = (id: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = cartItems.every((item) => item.selected);
    setCartItems((items) =>
      items.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const getTotalPrice = (): string =>
    cartItems
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);

  useEffect(() => {
    const userId = auth.id;
    fetchUserCart(userId).then(response => {
      if (response === null) {
        createTransaction({
          userId: userId,
          products: [],
          status: "cart"
        });
      } else {
        setProductList(response.products);
      }
    })
  }, []);

  async function f() {
    console.log("prod", productList)

    const cartItems = await Promise.all(productList.map(async (product) => { 

      const prodDetails = await getProduct(product.productId);

      console.log(prodDetails);

      return {
        id: product.productId,
        name: prodDetails.productInfo.data.name,
        description: prodDetails.productInfo.data.description,
        photoUrl: prodDetails.productInfo.data.imageUrl,
        price: parseFloat(prodDetails.productInfo.data.price) as number,
        quantity: product.amount,
        selected: false,
      }
    }));

    setCartItems(cartItems);
  }

  useEffect(() => {
    f();
  }, [productList]);

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

  async function handleCheckOut() {
    const userId = auth.id;
    const transaction = await fetchUserCart(userId);

    if (transaction !== null) {
      await updateTransaction(transaction._id, {
        status: "pending"
      });
    }

    let totalPrice = 0;
    for (let i = 0; i < transaction.products.length; i++) {

      const product = await getProduct(transaction.products[i].productId)

      totalPrice += (product.productInfo.data.price * transaction.products[i].amount);
      
      // deduct product inventory stock
      await updateProduct(transaction.products[i].productId, 
        undefined, undefined, undefined, 
        product.productInfo.data.countInStock - transaction.products[i].amount,
        undefined
      );
    }

    const isValid = await deductVouchers(userId, totalPrice);

    if (isValid) {
      displaySnackbar("You have checked out! Your transaction will be checked by one of our staff shortly.");
      setProductList([]);

      // create a new cart
      createTransaction({
        userId: userId,
        products: [],
        status: "cart"
      });
    }
  }

  const [ vouchers, setVouchers ] = useState(0);
  
  const getVouchers = async (userId: string) => {
    const userInfo = await getUserById(userId);
    setVouchers(userInfo.data.voucher);
  }

  const deductVouchers = async (userId: string, toDeduct : number) => {

    console.log(toDeduct);

    if (vouchers < toDeduct) {
      displaySnackbar("Not enough voucher credits! Try to clear your cart");
      return false;
    } else {
      await updateAccount({
        id: userId,
        voucher: vouchers - toDeduct
      });
      await getVouchers(auth.id);
      return true;
    }
  }

  useEffect(()=> {
    getVouchers(auth.id);
  }, [])

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Hi {auth.username},
      </Typography>

      <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
        Shopping Cart
      </Typography>

      <Grid2
        container
        spacing={2}
        style={{
          padding: "16px",
          alignItems: "center",
        }}
      >
        <Grid2 size={{ xs: 0.5 }}>
          <Checkbox
            checked={cartItems.every((item) => item.selected)}
            onChange={handleSelectAll}
          />
        </Grid2>
        <Grid2 size={{ xs: 4 }}>
          <Typography variant="body1" fontWeight="bold">
            Product
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            Unit Price
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            Quantity
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            Total Price
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            Actions
          </Typography>
        </Grid2>
      </Grid2>
      <Divider style={{ marginBottom: "16px" }} />
      <Box>
        {cartItems.map((item) => (
          <CartItemComponent
            key={item.id}
            item={item}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onSelect={handleSelect}
          />
        ))}
      </Box>

      <Paper
        elevation={3}
        style={{ padding: "16px", marginTop: "16px", position: "relative" }}
      >
        <Typography variant="h6">Summary</Typography>
        <Typography variant="body1">Total Price: {getTotalPrice()} points</Typography>
        <Box
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "8px" }}>
            Voucher Balance: { vouchers } points
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "150px" }}
            onClick={ handleCheckOut }
          >
            Check Out
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Home;
