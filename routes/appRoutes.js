const { Router } = require("express");
const router = Router();
const appControllers = require("../controllers/appControllers");

//landing 
router.get('/', appControllers.landingGet);

//login
router.get('/login', appControllers.loginGet);
router.post('/login', appControllers.loginPost);

//user signup
router.get('/userSignup', appControllers.userSignupGet)
router.post('/userSignup', appControllers.userSignupPost);

//account confirmation
router.post('/accountConfirmation', appControllers.accountConfirmationPost);

//user page
router.get('/user', appControllers.userPageGet)
router.post('/user', appControllers.userPagePost);
router.get("/user/setting", appControllers.userPageSettingGet);
router.get('/user/search', appControllers.userPageSearchGet);
router.post('/user/search', appControllers.userPageSearchPost);
router.get('/user/account', appControllers.userPageAccountGet);
router.get('/user/package', appControllers.userPagePackageGet);
router.post('/user/package', appControllers.userPagePackagePost);
router.get('/user/payment', appControllers.userPagePaymentGet);
router.post('/user/payment', appControllers.userPagePaymentPost);

//user search
// router.get('/user/search', appControllers.userSearchGet);


//creator signup 
router.get('/creatorSignup',appControllers.creatorSignupGet)
router.post('/creatorSignup', appControllers.creatorSignupPost);
//creator page
router.get('/creator', appControllers.creatorPageGet);
router.post('/creator', appControllers.creatorPagePost);
router.get('/creator/account', appControllers.creatorPageAccountGet);
router.get('/creator/setting', appControllers.creatorPageSettingGet);



module.exports = router;