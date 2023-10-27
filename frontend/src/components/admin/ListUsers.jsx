import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { MDBDataTable } from 'mdbreact'
import { Link } from 'react-router-dom'
import MetaData from '../layouts/MetaData'
import AdminLayout from '../layouts/AdminLayout'
import { useGetAdminUsersQuery } from '../../redux/api/userApi'

const ListUsers = () => {



    // const [deleteOrder, { error: deleteError, isSuccess, isLoading: isDeleteLoading }] = useDeleteOrderMutation();

    const { data, isLoading, error } = useGetAdminUsersQuery();


    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
            console.log(error);
        }
        // if (deleteError) {
        //     toast.error(deleteError?.data?.message)
        //     console.log(deleteError);
        // }
        // if (isSuccess) {
        //     toast.success("Order deleted")
        // }

    }, [error])

    // const deleteOrderHandler = (id) => {
    //     deleteOrder(id);
    // }



    const setUsers = () => {
        const users = {
            columns: [
                {
                    label: "ID",
                    field: "id",
                    sort: "asc",
                },

                {
                    label: "Name",
                    field: "name",
                    sort: "asc",
                },
                {
                    label: "Email",
                    field: "email",
                    sort: "asc",
                },
                {
                    label: "Role",
                    field: "role",
                    sort: "asc"
                },
                {
                    label: "Actions",
                    field: "actions",
                    sort: "asc",
                }
            ],
            rows: [],
        };

        data?.users?.forEach((user) => {
            users.rows.push({
                id: user?._id,
                name: user?.name,
                email: user?.email,
                role: user?.role,
                actions: <>
                    <Link to={`/admin/users/${user?._id}`} className='btn btn-outline-primary' >
                        <i className='fa fa-pencil'></i>
                    </Link>


                    <button
                        className="btn btn-outline-danger ms-2"
                    // onClick={() => deleteuserHandler(order?._id)}
                    // disabled={isDeleteLoading}
                    >
                        <i className="fa fa-trash"></i>
                    </button>

                </>
            })
        })

        return users;
    }

    return (

        <AdminLayout>
            <MetaData title={"All Users"} />
            <div>
                <h1 className="my-5">{data?.users?.length} Users</h1>

                <MDBDataTable
                    data={setUsers()}
                    className='px-3'
                    bordered
                    striped
                    hover
                />
            </div>
        </AdminLayout>

    )
}

export default ListUsers