import React from "react";

type DrawerProps = {
    children: React.ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({children}) => {
    return (
        <div className="drawer drawer-mobile">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* <!-- Page content here --> */}
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                    {/* <!-- Sidebar content here --> */}
                    <li>
                        <a>Mes invitations</a>
                    </li>
                    <li>
                        <a>Mes listes</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};
export default Drawer;
