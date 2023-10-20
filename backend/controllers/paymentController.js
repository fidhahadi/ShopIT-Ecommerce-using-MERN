const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



//Create stripe checkout session = >  /api/v1/payment/checkout_session

exports.stripeCheckoutSession = catchAsyncErrors(
    async (req, res, next) => {

        const body = req?.body;

        const line_items = body?.orderItems?.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item?.name,
                        images: [item?.image],
                        metadata: {
                            productId: item?.product
                        },
                    },
                    unit_amount: item?.price * 100
                },
                tax_rates: ["txr_1O3LdDDoXoQTZ5kwyQaWFgKw"],
                quantity: item?.quantity,
            };
        });


        const shippingInfo = body?.shippingInfo


        const shipping_rate = body?.itemPrice >= 200 ? "shr_1O3M8SDoXoQTZ5kw2onng9RO" : "shr_1O3LTGDoXoQTZ5kwgbZRplUW";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${process.env.FRONTEND_URL}/me/orders`,
            cancel_url: `${process.env.FRONTEND_URL}`,
            customer_email: req?.user?.email,
            client_reference_id: req?.user?._id?.toString(),
            mode: 'payment',
            metadata: {
                ...shippingInfo,
                itemPrice: body?.itemPrice,
            },
            shipping_options: [
                {
                    shipping_rate,
                },
            ],
            line_items,
        });

        console.log(session);

        res.status(200).json({
            url: session?.url,

        })
    })