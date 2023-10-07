import { React } from 'react'
import MetaData from './layouts/MetaData'
import { useGetProductsQuery } from '../api/productsApi'

import ProductItem from './product/ProductItem'



const Home = () => {

    const { data, isLoading } = useGetProductsQuery();
    console.log(data, isLoading);

    return (
        <>
            <MetaData title={'Buy Best Products Online'} />
            <h1 id='products_heading'>Latest Products</h1>
            <section id="products" className="container mt-5">
                <div className="row">
                    {
                        data?.products?.map((product) => (
                            <ProductItem product={product} />
                        ))
                    }

                </div>
            </section>
        </>
    )
}

export default Home