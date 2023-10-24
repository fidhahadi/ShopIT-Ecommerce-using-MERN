const express = require('express');
const router = express.Router();


const { newOrder,
    getSingleOrder,
    myOrders,
    allOrders,
    updateOrderStatus,
    deleteOrder,
    getSales } = require('../controllers/orderController');


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/orders/new').post(isAuthenticatedUser, newOrder);

router.route('/orders/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/me/orders').get(isAuthenticatedUser, myOrders);


router.route('/admin/get_sales').get(isAuthenticatedUser, authorizeRoles('admin'), getSales);


router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), allOrders);

router.route('/admin/orders/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);


module.exports = router;