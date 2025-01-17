import React, { useEffect, useState } from "react";
import {
  Box,
  Grid2,
  Typography,
  Paper,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import { getTransactionById, getTransactions, updateTransaction } from "../../api/transaction";
import { Product } from "../../api/product";
import { CloseRounded, DoneRounded } from "@mui/icons-material";

interface Transaction {
  _id: string;
  userId: string;
  products: {
    productId: Product,
    amount: number
  }[];
  status: "cart" | "pending" | "approved" | "rejected";
  createdAt: Date;
}

interface TransactionProps {
  item: Transaction,
  onApprove: (transactionId : string) => void, 
  onReject: (transactionId : string) => void, 
}

const CartItemComponent: React.FC<TransactionProps> = ({ item, onApprove, onReject }) => {
  let totalPrice = 0;
  for (let i = 0; i < item.products.length; i++) {
    totalPrice += (item.products[i].productId.price * item.products[i].amount);
  }

  return (
    <Paper elevation={2} style={{ padding: "16px", marginBottom: "16px" }}>
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1">
            { item.userId }
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <ul>
            { item.products.map(product => (<li>
              { product.amount.toString() }x {product.productId.name} 
            </li>)) }
          </ul>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1" color="primary">
            {totalPrice} points
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 1 }}>{item.status.toUpperCase()[0] + item.status.substring(1)}</Grid2>
        <Grid2 size={{ xs: 1 }}>
          {item.status === "pending" ? (
            <Stack direction="row" gap="2">
              <IconButton onClick={() => onApprove(item._id)}>
                <DoneRounded sx={{ color: "green" }} />
              </IconButton>
              <IconButton onClick={() => onReject(item._id)}>
                <CloseRounded sx={{ color: "red" }} />
              </IconButton>
            </Stack>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No Action
            </Typography>
          )}
        </Grid2>
      </Grid2>
    </Paper>
  );
};

const Transactions: React.FC = () => {
  const [transactionItems, setTransactionItems] = useState<Transaction[]>([]);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filteredItems = transactionItems.filter((item: Transaction) => {
    if (selectedTab === 0) return item.status !== "cart";
    if (selectedTab === 1) return item.status === "rejected";
    if (selectedTab === 2) return item.status === "approved";
    return true;
  });

  const handleApproval = async (id: string) => {
    // setCartItems((items) => items.filter((item) => item.id !== id));
    const transaction = await getTransactionById(id);
    
    if (transaction !== null) {
      await updateTransaction(transaction._id, {
        status: "approved"
      });
    }
    
    fetchTransactions();
  };

  const handleRejection = async (id: string) => {
    // setCartItems((items) => items.filter((item) => item.id !== id));
    const transaction = await getTransactionById(id);
    
    if (transaction !== null) {
      await updateTransaction(transaction._id, {
        status: "rejected"
      });
    }
    
    fetchTransactions();
  };

  const fetchTransactions = async () => {
    const transactions = await getTransactions() as Transaction[];
    setTransactionItems(transactions);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Transactions
      </Typography>

      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="All" />
        <Tab label="Cancelled" />
        <Tab label="Completed" />
      </Tabs>

      <Divider style={{ margin: "16px 0" }} />

      <Grid2 container spacing={2} style={{ padding: "16px" }}>
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            Resident
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            Items
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            Total Price
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            Status
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
        {filteredItems.map((item: Transaction) => (
          <CartItemComponent
            key={item._id}
            item={item}
            onApprove={handleApproval}
            onReject={handleRejection}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Transactions;
