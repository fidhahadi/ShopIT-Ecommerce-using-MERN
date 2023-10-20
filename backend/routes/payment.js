const express = require('express');
const router = express.Router();

const { stripeCheckoutSession } = require('../controllers/paymentController');


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')


router.route('/payment/checkout_session').post(isAuthenticatedUser, stripeCheckoutSession);




module.exports = router;