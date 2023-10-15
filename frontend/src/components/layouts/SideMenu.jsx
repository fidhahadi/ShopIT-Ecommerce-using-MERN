import React from 'react'

const SideMenu = () => {
    return (
        <>
            <div className="list-group mt-5 pl-4">
                <a
                    href="menu-item-url-1"
                    className="fw-bold list-group-item list-group-item-action active"
                >
                    <i className="menu-item-icon-1 fa-fw pe-2"></i> Menu Item 1
                </a>
                <a
                    href="menu-item-url-2"
                    className="fw-bold list-group-item list-group-item-action "
                    aria-current="true"
                >
                    <i className="menu-item-icon-2 fa-fw pe-2"></i> Menu Item 2
                </a>
            </div>

        </>
    )
}

export default SideMenu