import React from 'react'
import MetaData from '../layouts/MetaData'

const Payment = () => {
    return (
        <>
            <MetaData title={"Payment "} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form
                        className="shadow rounded bg-body"
                        action="your_submit_url_here"
                        method="post"
                    >
                        <h2 className="mb-4">Select Payment Method</h2>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment_mode"
                                id="codradio"
                                value="COD"
                            />
                            <label className="form-check-label" for="codradio">
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
                            />
                            <label className="form-check-label" for="cardradio">
                                Card - VISA, MasterCard
                            </label>
                        </div>

                        <button id="shipping_btn" type="submit" className="btn py-2 w-100">
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Payment