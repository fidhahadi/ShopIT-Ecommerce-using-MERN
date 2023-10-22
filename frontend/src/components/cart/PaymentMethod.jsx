import React, { useEffect, useState } from 'react'
import MetaData from '../layouts/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux';
import { calculateOrderCost } from '../../helpers/helpers';
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const PaymentMethod = () => {

    const navigate = useNavigate();
    const [method, setMethod] = useState("");

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateOrderCost(cartItems);

    const [createNewOrder, { error, isSuccess }] = useCreateNewOrderMutation();

    const [stripeCheckoutSession, { data: checkoutdata, error: checkoutError, isLoading }] = useStripeCheckoutSessionMutation();


    useEffect(() => {
        if (checkoutdata) {
            window.location.href = checkoutdata?.url;
        }
        if (checkoutError) {
            toast.error(checkoutError?.data?.message);
        }
    }, [checkoutdata, checkoutError])

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
        }
        if (isSuccess) {
            navigate("/me/orders?order_success=true");
        }
    }, [error, isSuccess])

    const submitHandler = (e) => {
        e.preventDefault();

        if (method === "COD") {
            // Create COD Order
            const orderData = {
                shippingInfo,
                orderItems: cartItems,
                itemsPrice,
                shippingAmount: shippingPrice,
                taxAmount: taxPrice,
                totalAmount: totalPrice,
                paymentInfo: {
                    status: "Not Paid",
                },
                paymentMethod: "COD",
            };

            createNewOrder(orderData);
        }


        if (method === "Card") {
            //Stripe checkout
            const orderData = {
                shippingInfo,
                orderItems: cartItems,
                itemsPrice,
                shippingAmount: shippingPrice,
                taxAmount: taxPrice,
                totalAmount: totalPrice,
            };

            stripeCheckoutSession(orderData);
        }
    }


    return (
        <>
            <MetaData title={"Payment"} />
            <CheckoutSteps shipping confirmOrder payment />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form
                        className="shadow rounded bg-body"
                        onSubmit={submitHandler}
                    >
                        <h2 className="mb-4">Select Payment Method</h2>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment_mode"
                                id="codradio"
                                value="COD"
                                onChange={(e) => setMethod("COD")}
                            />
                            <label className="form-check-label" htmlFor="codradio">
                                Cash on Delivery
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment_mode"
                                id="cardradio"
                                value="Card"
                                onChange={(e) => setMethod("Card")}
                            />
                            <label className="form-check-label" htmlFor="cardradio">
                                Card - VISA, MasterCard
                            </label>
                        </div>

                        <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default PaymentMethod