const express = require('express');
const router = express.Router();

const { stripeCheckoutSession,
    stripeWebhook } = require('../controllers/paymentController');


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')


router.route('/payment/checkout_session').post(isAuthenticatedUser, stripeCheckoutSession);


router.route('/payment/webhook').post(stripeWebhook);




module.exports = router;