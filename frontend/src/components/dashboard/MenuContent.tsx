import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { Link } from "react-router";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { useEffect } from "react";
import { getPathName } from "../../utils/utils";
import { useAuth } from "../../contexts/AuthContext";
import Divider from "@mui/material/Divider";
import {
  InventoryRounded,
  ManageAccounts,
  ReceiptLong,
  TaskRounded,
} from "@mui/icons-material";
import AssignmentRounded from "@mui/icons-material/AssignmentRounded";

export default function MenuContent() {
  const mainListItems = [
    { text: "Home", icon: <HomeRoundedIcon />, path: "/" },
    { text: "Products", icon: <ShoppingCart />, path: "/products" },
    {
      text: "Transactions",
      icon: <AnalyticsRoundedIcon />,
      path: "/transactions",
    },
    {
      text: "Voucher Task",
      icon: <AssignmentRounded />,
      path: "/voucher-task",
    },
    { text: "Accept Tasks", icon: <TaskRounded />, path: "/tasks" },
  ];

  const adminListItems = [
    { text: "Manage Users", icon: <ManageAccounts />, path: "/manage-users" },
    { text: "Manage Tasks", icon: <ManageAccounts />, path: "/manage-tasks" },
    {
      text: "Manage Requests",
      icon: <ReceiptLong />,
      path: "/manage-requests",
    },
    { text: "Inventory", icon: <InventoryRounded />, path: "/inventory" },

    {
      text: "Voucher Approval",
      icon: <AssignmentRounded />,
      path: "/voucher-approval",
    },
  ];

  const secondaryListItems: any[] = [
    // { text: "Settings", icon: <SettingsRoundedIcon /> },
    // { text: "About", icon: <InfoRoundedIcon /> },
    // { text: "Feedback", icon: <HelpRoundedIcon /> },
  ];

  const { auth } = useAuth();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useEffect(() => {
    let index: number = 0;

    // path (may include / at the end)
    const path = getPathName();

    for (index = 0; index < mainListItems.length; index++) {
      if (path === mainListItems[index].path) {
        setSelectedIndex(index);
        return;
      }
    }
    for (
      index = mainListItems.length;
      index < mainListItems.length + adminListItems.length;
      index++
    ) {
      if (path === adminListItems[index - mainListItems.length].path) {
        setSelectedIndex(index);
        return;
      }
    }
  });

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {auth.isAdmin ? <Divider sx={{ my: 1.3 }} /> : <></>}
        {auth.isAdmin ? (
          adminListItems.map((item, index) => (
            <ListItem
              key={index + mainListItems.length}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={selectedIndex === index + mainListItems.length}
                onClick={() =>
                  handleListItemClick(index + mainListItems.length)
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <></>
        )}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
