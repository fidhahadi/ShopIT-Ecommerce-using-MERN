import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react';
import Pagination from 'react-js-pagination'



const CustomPagination = ({ resPerPage, filterProductsCount }) => {

    const [currentPage, setCurrentPage] = useState();

    let [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    useEffect(() => {
        setCurrentPage(page);
    }, [page])


    const setCurrentPageNo = () => {

    }

    return (
        <>
            {filterProductsCount > resPerPage && (
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={10}
                    totalItemsCount={450}
                    onChange={setCurrentPageNo}
                />
            )}

        </>
    );
}

export default CustomPagination