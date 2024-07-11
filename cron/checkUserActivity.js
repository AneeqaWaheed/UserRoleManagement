import cron from 'node-cron';
import { checkUserActivityById } from '../helpers/checkuseractivity.js';
import userModel from '../models/userModel.js';

const scheduleUserActivityCheck = () => {
  cron.schedule('0 * * * *', async () => { // Runs every hour
    console.log('Running a task every hour to check user activity');
    try {
      const users = await userModel.find();
      for (const user of users) {
        await checkUserActivityById(user._id);
      }
    } catch (error) {
      console.error('Error checking user activity:', error);
    }
  });
};

export default scheduleUserActivityCheck;
