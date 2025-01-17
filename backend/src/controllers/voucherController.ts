import { Request, Response } from "express";
import Voucher from "../models/voucherModel"; // Assuming Voucher model is in '../models/Voucher'
import User from "../models/userModel";

// Controller to create a new voucher
export const createVoucher = async (req: Request, res: Response) => {
  const { title, subtitle, description, points, slots } = req.body;

  try {
    // Check if the required fields are provided
    if (!title || !subtitle || !description || !points || !slots) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Create the new voucher
    const newVoucher = new Voucher({
      title,
      subtitle,
      description,
      points,
      slots,
      status: "pending", // Default status is pending when created
    });

    // Save the voucher to the database
    await newVoucher.save();

    res
      .status(201)
      .json({ message: "Voucher created successfully", voucher: newVoucher });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

/**
 * Accept a voucher
 * Checks if there are available slots, if so, decrements the slots and adds user to acceptedBy.
 */
export const acceptVoucher = async (req: Request, res: Response) => {
  const { voucherId, userId } = req.body;

  try {
    // Fetch the voucher by ID
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      res.status(404).json({ message: "Voucher not found" });
      return;
    }

    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if the user has already accepted this voucher
    const userStatus = user.userStatuses.find(
      (status) => status.voucherId.toString() === voucherId
    );

    if (userStatus?.status === "pending") {
      res
        .status(400)
        .json({ message: "You have already accepted this voucher" });
      return;
    }

    // Check if there are available slots in the voucher
    if (voucher.slots <= 0) {
      res.status(400).json({ message: "No available slots for this voucher" });
      return;
    }

    // Update the voucher's `acceptedBy`, `userStatuses`, and decrement slots
    voucher.acceptedBy.push(userId);
    voucher.slots -= 1;

    // Add or update userStatuses for the voucher
    if (userStatus) {
      userStatus.status = "pending"; // Update existing status
    } else {
      user.userStatuses.push({
        voucherId,
        status: "pending",
      });
    }

    // Add or update the voucher's userStatuses for the user
    const voucherUserStatus = voucher.userStatuses.find(
      (status) => status.userId.toString() === userId
    );

    if (voucherUserStatus) {
      voucherUserStatus.status = "pending"; // Update existing status
    } else {
      voucher.userStatuses.push({
        userId,
        status: "pending", // Add a new status for this user
      });
    }

    // Save both documents
    await user.save();
    await voucher.save();

    res.status(200).json({
      message: "Voucher accepted successfully",
      voucher,
    });
    return;
  } catch (error) {
    console.error("Error accepting voucher:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

/**
 * Get all vouchers available for acceptance
 */
export const getAvailableVouchers = async (req: Request, res: Response) => {
  try {
    const vouchers = await Voucher.find({ slots: { $gt: 0 } });
    res.status(200).json(vouchers);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getAllVoucher = async (req: Request, res: Response) => {
  try {
    const vouchers = await Voucher.find({});
    res.status(200).json(vouchers);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const deleteVoucher = async (req: Request, res: Response) => {
  const { voucherId } = req.body;

  try {
    // Find the voucher by ID
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      res.status(404).json({ message: "Voucher not found" });
      return;
    }

    // Check all users who accepted the voucher
    const users = await User.find({
      "userStatuses.voucherId": voucherId,
    });

    for (const user of users) {
      const userStatusIndex = user.userStatuses.findIndex(
        (status) => status.voucherId.toString() === voucherId
      );

      if (userStatusIndex !== -1) {
        user.userStatuses.splice(userStatusIndex, 1);
        await user.save(); // Save the updated user document
      }
    }

    // Delete the voucher
    await Voucher.findByIdAndDelete(voucherId);

    res.status(200).json({ message: "Voucher deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting voucher:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// User completes the voucher
export const completeVoucher = async (req: Request, res: Response) => {
  const { voucherId, userId } = req.body;

  try {
    // Find the voucher by ID
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      res.status(404).json({ message: "Voucher not found" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Check if the user has accepted the voucher
    const userStatus = voucher.userStatuses.find(
      (status) => status.userId.toString() === userId
    );

    if (!userStatus || userStatus.status !== "pending") {
      res.status(400).json({
        message:
          "You cannot complete a voucher you have not accepted or is not pending",
      });
      return;
    }

    // Update the user's status for the voucher to 'completed'
    userStatus.status = "approval";
    // Save the updated voucher
    await voucher.save();

    // Add or update userStatuses for the voucher
    if (userStatus) {
      const userUserStatus = user.userStatuses.find(
        (status) => status.voucherId.toString() === voucherId
      );
      if (userUserStatus) {
        userUserStatus.status = "approval";
      }
    }
    await user.save();

    res.status(200).json({
      message: "Voucher marked as completed and awaiting approval",
      voucher,
    });
    return;
  } catch (error) {
    console.error("Error completing voucher:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// Admin approves or cancels the voucher
export const adminApproveRejectVoucher = async (
  req: Request,
  res: Response
) => {
  const { voucherId, userId, action } = req.body;

  try {
    // Validate action
    if (!["completed", "cancelled"].includes(action)) {
      res
        .status(400)
        .json({ message: 'Invalid action. Use "completed" or "cancelled".' });
      return;
    }

    // Find the voucher
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      res.status(404).json({ message: "Voucher not found" });
      return;
    }

    // Ensure the voucher is in 'approval' state
    const userStatusVoucher = voucher.userStatuses.find(
      (status) => status.userId.toString() === userId
    );

    if (userStatusVoucher) {
      if (userStatusVoucher.status !== "approval") {
        res
          .status(400)
          .json({ message: "Voucher is not yet completed by the user." });
        return;
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const VoucherStatusVoucher = user.userStatuses.find(
      (status) => status.voucherId.toString() === voucherId
    );

    // Process the action
    if (action === "completed") {
      if (VoucherStatusVoucher) {
        VoucherStatusVoucher.status = "completed";
      }
      if (userStatusVoucher) {
        userStatusVoucher.status = "completed";
      }
      await User.findByIdAndUpdate(userId, {
        $inc: { voucher: voucher.points || 0 },
      });
    } else {
      if (VoucherStatusVoucher) {
        VoucherStatusVoucher.status = "cancelled";
      }
      if (userStatusVoucher) {
        userStatusVoucher.status = "cancelled";
      }
    }

    await voucher.save();
    await user.save();
    res
      .status(200)
      .json({ message: `Voucher ${action}d successfully`, voucher });
    return;
  } catch (error) {
    console.error("Error processing voucher action:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getUserVoucher = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId).populate({
      path: "userStatuses.voucherId", // Path to populate
      model: "Voucher", // Name of the referenced model
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Return the populated userStatuses
    res.status(200).json({
      message: "Vouchers retrieved successfully",
      userStatuses: user.userStatuses,
    });
    return;
  } catch (error) {
    console.error("Error retrieving voucher:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const updateVoucher = async (req: Request, res: Response) => {
  const { id, title, subtitle, description, points, slots } = req.body;

  try {
    // Retrieve voucher from the database using voucher ID
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      res.status(404).json({ message: "Voucher not found" });
      return;
    }

    // Update voucher properties
    voucher.title = title || voucher.title;
    voucher.subtitle = subtitle || voucher.subtitle;
    voucher.description = description || voucher.description;
    voucher.points = points || voucher.points;
    voucher.slots = slots || voucher.slots;

    // Save updated voucher
    await voucher.save();

    res.status(200).json({ message: "Voucher Updated" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unknown error when updating voucher" });
    return;
  }
};
