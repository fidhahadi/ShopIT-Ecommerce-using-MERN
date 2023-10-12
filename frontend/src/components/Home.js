import { React, useEffect } from 'react'
import MetaData from './layouts/MetaData'
import { useGetProductsQuery } from '../api/productsApi'

import ProductItem from './product/ProductItem'
import Loader from './layouts/Loader'
import toast from 'react-hot-toast'
import CustomPagination from './layouts/CustomPagination'
import { useSearchParams } from 'react-router-dom'


const Home = () => {


    let [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const keyword = searchParams.get("keyword") || "";

    const params = { page, keyword };


    const { data, isLoading, error, isError } = useGetProductsQuery(params);

    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message)
        }

    }, [isError, error])
    console.log(data);

    if (isLoading) return < Loader />

    return (

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