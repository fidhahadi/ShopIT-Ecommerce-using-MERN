const Order = require('../models/order');
const Product = require('../models/product');
//const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


//Create a new order = /api/v1/orders/new

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id,
    });

    res.status(200).json({
        order,
    });
});
// Get single order by id => /api/v1/order/:id

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler(`No orders by the id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        order
    })

})

//Get logged in user orders => /api/v1/orders/me


exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        orders
    })
})

//Get all the orders by different users by admin => /api/v1/admin/orders

exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })


    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})


//Update /Process order - admin => /api/v1/admin/order/:id

exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    if (order?.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    let productNotFound = false;

    // Update products stock
    for (const item of order.orderItems) {
        const product = await Product.findById(item?.product?.toString());
        if (!product) {
            productNotFound = true;
            break;
        }
        product.stock = product.stock - item.quantity;
        await product.save({ validateBeforeSave: false });
    }

    if (productNotFound) {
        return next(
            new ErrorHandler("No Product found with one or more IDs.", 404)
        );
    }

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true,
    });
});


async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });

}


// delete order  => /api/v1/admin/order/:id

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler(`No orders by the id ${req.params.id}`, 404));
    }
    await order.deleteOne()



    res.status(200).json({
        success: true
    })

})




async function getSalesData(startDate, endDate) {
    const salesData = await Order.aggregate([
        {
            // Stage 1 - Filter results
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            },
        },
        {
            // Stage 2 - Group Data
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                },
                totalSales: { $sum: "$totalAmount" },
                numOrders: { $sum: 1 }, // count the number of orders
            },
        },
    ]);

    // Create a Map to store sales data and num of order by data
    const salesMap = new Map();
    let totalSales = 0;
    let totalNumOrders = 0;

    salesData.forEach((entry) => {
        const date = entry?._id.date;
        const sales = entry?.totalSales;
        const numOrders = entry?.numOrders;

        salesMap.set(date, { sales, numOrders });
        totalSales += sales;
        totalNumOrders += numOrders;
    });

    // Generate an array of dates between start & end Date
    const datesBetween = getDatesBetween(startDate, endDate);

    // Create final sales data array with 0 for dates without sales
    const finalSalesData = datesBetween.map((date) => ({
        date,
        sales: (salesMap.get(date) || { sales: 0 }).sales,
        numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
    }));

    return { salesData: finalSalesData, totalSales, totalNumOrders };
}

function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        dates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

// Get Sales Data  =>  /api/v1/admin/get_sales
exports.getSales = catchAsyncErrors(async (req, res, next) => {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    getSalesData(startDate, endDate);

    const { salesData, totalSales, totalNumOrders } = await getSalesData(
        startDate,
        endDate
    );

    res.status(200).json({
        totalSales,
        totalNumOrders,
        sales: salesData,
    });
});