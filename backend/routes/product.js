const express = require('express');
const router = express.Router();


const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview
} = require('../controllers/productController')

const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');


router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthenticatedUser, authorizedRoles('admin'), newProduct);

router.route('/admin/product/:id').put(isAuthenticatedUser, authorizedRoles('admin'), updateProduct);
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizedRoles('admin'), deleteProduct);

router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(isAuthenticatedUser, getProductReviews);
router.route('/admin.reviews').delete(isAuthenticatedUser, authorizedRoles('admin'), deleteReview);



module.exports = router;
