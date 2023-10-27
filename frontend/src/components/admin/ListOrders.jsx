import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { MDBDataTable } from 'mdbreact'
import { Link } from 'react-router-dom'
import MetaData from '../layouts/MetaData'

import { useGetAdminOrdersQuery } from '../../redux/api/orderApi'
import AdminLayout from '../layouts/AdminLayout'

const ListOrders = () => {



    const { data, error } = useGetAdminOrdersQuery();

    console.log(data);
    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
        }
        // if (deleteError) {
        //     toast.error(deleteError?.data?.message)
        //     console.log(deleteError);
        // }
        // if (isSuccess) {
        //     toast.success("Product deleted")
        // }

    }, [error])

    // const deleteProductHandler = (id) => {
    //     deleteProduct(id);
    // }



    const setOrders = () => {
        const orders = {
            columns: [
                {
                    label: "ID",
                    field: "id",
                    sort: "asc"
                },
                {
                    label: "Payment Status",
                    field: "paymentstatus",
                    sort: "asc",
                },
                {
                    label: "Order Status",
                    field: "orderstatus",
                    sort: "asc",
                },
                {
                    label: "Actions",
                    field: "actions",
                    sort: "asc",
                }
            ],
            rows: [],
        };

        data?.orders?.forEach((order) => {
            orders.rows.push({
                id: order?._id,
                name: `${order?.name?.substring(0, 20)}...`,
                paymentstatus: order?.paymentInfo?.status?.toUpperCase(),
                orderstatus: order?.orderStatus,
                actions: <>
                    <Link to={`/admin/order/${order?._id}`} className='btn btn-outline-primary' >
                        <i className='fa fa-pencil'></i>
                    </Link>


                    <button
                        className="btn btn-outline-danger ms-2"
                    // onClick={() => deleteorderHandler(product?._id)}
                    // disabled={isDeleteLoading}
                    >
                        <i className="fa fa-trash"></i>
                    </button>

                </>
            })
        })

        return orders;
    }

    return (

        <AdminLayout>
            <MetaData title={"All Products"} />
            <div>
                <h1 className="my-5">{data?.orders?.length} Orders</h1>

                <MDBDataTable
                    data={setOrders()}
                    className='px-3'
                    bordered
                    striped
                    hover
                />
            </div>
        </AdminLayout>

    )
}

export default ListOrders