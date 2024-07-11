import express from 'express';
import {registerController, LoginController, updateProfileController,allUsers,delUser} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { checkUserActivityById } from '../helpers/checkuseractivity.js'
//router object
const router = express.Router();


//routing
//REGISTER || METHOD POST
router.post('/register', registerController);

//LOGIN || METHOD POST
router.post('/login', LoginController);


//protected  User route auth
router.get('/user-auth', requireSignIn, (req,res)=>{
    res.status(200).send({ok:true});
});

//protected Admin route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req,res)=>{
    res.status(200).send({ok:true});
});

//update profile

router.put('/update-profile/:id',requireSignIn, updateProfileController);
//get all users
router.get('/users', allUsers);
//delete user with id
router.delete('/delUser/:id', delUser);
//user active or not
router.get('/check-user-activity/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      
      console.log('Checking user activity for user ID:', userId);
      const user = await checkUserActivityById(userId);
      res.status(200).json({ message: `User ${user.email} is now ${user.isActive ? 'active' : 'inactive'}`, user });
    } catch (error) {
      res.status(500).json({ message: 'Error checking user activity', error: error.message });
    }
  });
export default router;