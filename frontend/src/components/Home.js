import { React, useEffect } from 'react'
import MetaData from './layouts/MetaData'
import { useGetProductsQuery } from '../api/productsApi'

import ProductItem from './product/ProductItem'
import Loader from './layouts/Loader'
import toast from 'react-hot-toast'
import CustomPagination from './layouts/CustomPagination'

const Home = () => {

    const { data, isLoading, error, isError } = useGetProductsQuery();
    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message)
        }

    }, [isError, error])


    if (isLoading) return < Loader />

    return (
        // <>
        //     <MetaData title={'Buy Best Products Online'} />

        //     <h1 id='products_heading'>Latest Products</h1>
        //     <section id="products" className="container mt-5">
        //         <div className="row">
        //             {
        //                 data?.products?.map((product) => (
        //                     <ProductItem product={product} />
        //                 ))
        //             }

        //         </div>
        //     </section>
        //     <CustomPagination resPerPage={data?.resPerPage} filterProductsCount={data?.filterProductsCount} />
        // </>
        <>
            <MetaData title={"Buy Best Products Online"} />
            <div className="row">

                <section id="products" className="mt-5">
                    <div className="row">
                        {data?.products?.map((product) => (
                            <ProductItem product={product} columnSize={20} />
                        ))}
                    </div>
                </section>

                <CustomPagination
                    resPerPage={data?.resPerPage}
                    filteredProductsCount={data?.filteredProductsCount}
                />
            </div>
        </>

    )
}






export default Home