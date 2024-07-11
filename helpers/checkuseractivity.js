// helpers/checkUserActivity.js
import userModel from "../models/userModel.js";
export const checkUserActivityById = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const isActive = true; 

    if (user.isActive !== isActive) {
      user.isActive = isActive;
      await user.save();
      console.log(`User ${user.email} is now ${isActive ? 'active' : 'inactive'}`);
    }

    return user;
  } catch (error) {
    console.error('Error checking user activity:', error);
    throw error;
  }
};

