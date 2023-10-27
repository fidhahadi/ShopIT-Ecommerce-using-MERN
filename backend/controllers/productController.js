const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFilters = require('../utils/apiFilters');
const Order = require("../models/order")
const upload = require("../utils/cloudinary");
const delete_f = require("../utils/cloudinary");

//create new product => /api/v1/product/new

exports.newProduct = catchAsyncErrors(async (req, res) => {
    req.body.user = req.user._id;

    const product = await Product.create(req.body);

    res.status(200).json({
        product,
    });
});

//Get all products => /api/v1/products

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    });
});

//Get single product details = > /api/v1/product/:id

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id).populate('reviews.user')

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        product,
    });
});



//Get products -ADMIN = > /api/v1/admin/products

exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();


    res.status(200).json({
        products,
    });
});


//updat eproduct => /api/v1/admin/product/:id

exports.updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
        new: true,
    });

    res.status(200).json({
        product,
    });
});




//upload product images => /api/v1/admin/product/:id/upload_images

exports.uploadProductImages = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);


    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const uploader = async (image) => upload.upload_file(image, "shopIT");

    const urls = await Promise.all((req?.body?.images)?.map(uploader));

    product?.images?.push(...urls);
    await product?.save();

    res.status(200).json({
        product,
    });
});


//delete product images => /api/v1/admin/product/:id/delete_image

exports.deleteProductImage = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);


    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isDeleted = await delete_f.delete_file(req?.body?.imgId)

    if (isDeleted) {
        product.images = product?.images?.filter(
            (img) => img?.public_id !== req?.body?.imgId
        );
        await product?.save();
    }

    res.status(200).json({
        product,
    });
});




//delete  product => /api/v1/admin/product/:id

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {


    const product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }


    //delete images associated with it
    for (let i = 0; i < product?.images?.length; i++) {
        await delete_f.delete_file(product?.images[i].public_id);
    }


    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Product is deleted'
    })

})


//Crreate new review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product?.reviews?.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review?.user?.toString() === req?.user?._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});
//Get product reviews => /api/v1/reviews

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        reviews: product.reviews,
        numOfReviews: product.numOfReviews,
    });
});


//delete product reviews => /api/v1/reviews

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product?.reviews?.filter(
        (review) => review._id.toString() !== req?.query?.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
        numOfReviews === 0
            ? 0
            : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            numOfReviews;

    product = await Product.findByIdAndUpdate(
        req.query.productId,
        { reviews, numOfReviews, ratings },
        { new: true }
    );

    res.status(200).json({
        success: true,
        product,
    });
});


//Can user review => /api/v1/can_review
exports.canUserReview = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find({
        user: req.user._id,
        "orderItems.product": req.query.productId,
    })

    if (orders.length === 0) {
        return res.status(200).json({ canReview: false })
    }

    res.status(200).json({
        canReview: true,
    });
})