const express = require('express');
const router = express.Router();


const { newOrder,
    getSingleOrder,
    myOrders,
    allOrders,
    updateOrderStatus,
    deleteOrder } = require('../controllers/orderController');


const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);

router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

router.route('/admin/orders').get(isAuthenticatedUser, authorizedRoles('admin'), allOrders);

router.route('/admin/order/:id').put(isAuthenticatedUser, authorizedRoles('admin'), updateOrderStatus)
    .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteOrder);


module.exports = router;