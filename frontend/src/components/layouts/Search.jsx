import React, { useState } from 'react'
import { useNavigate } from 'react-router';

const Search = () => {


    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const submitHandler = (e) => {

        e.preventDefault()


        if (keyword?.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate(`/`);
        }
    }

    return (
        <>
            <form onSubmit={submitHandler}>
                <div className="input-group">
                    <input
                        type="text"
                        id="search_field"
                        aria-describedby="search_btn"
                        className="form-control"
                        placeholder="Enter Product Name ..."
                        name="keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}

                    />
                    <button id="search_btn" onSubmit={submitHandler} className="btn" type="submit">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </form>
        </>
    )
}

export default Search