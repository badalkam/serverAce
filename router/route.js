import { Router } from "express";

const router = Router();
import registerMail from '../controller/mailer.js'
import otp from '../controller/otp.js'


//import all controller
import * as controller from '../controller/appController.js'
import Auth from "../middleware/auth.js";
import localVeriables from "../middleware/auth.js"



// POST method
router.route('/register').post(controller.register) //register user
router.route('/registerMail').post(registerMail) //send mail
router.route('/otp').post(otp) //send mail

router.route('/authenticate').post(controller.verifyUser,(req,res)=>{res.end()}) //authenticate user
router.route('/login').post(controller.login) //login in app
router.route('/create').post(controller.CreateProperty) //login in app



// GET Method
router.route('/user/:username').get(controller.getUser) //user with username
router.route('/searchById/:id').get(controller.searchPropertyById) //user with username
router.route('/find/:username').get(controller.searchPropertyByUsername) //user with username
router.route('/generateOTP').get(controller.generateOTP) //generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP) // verifyOTP generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all averiable
router.route('/search').get(controller.searchProperty) // reset all averiable
router.route('/searchsell').get(controller.searchSellProperty) // reset all averiable



// PUT Method
router.route('/updateProperty/:id').put(Auth,controller.UpdateProperty)   // use to update user pofile
router.route('/resetPassword').put(controller.resetPassword) // use to reset password

//DETETE Method
router.route('/deteleProperty/:id').delete(Auth,controller.deteleProperty)





export default router;