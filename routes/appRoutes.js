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
router.post('/', appControllers.userPagePost);

//creator signup 
// router.get('/creatorSignup',)
// router.post('/creatorSignup',)


module.exports = router;