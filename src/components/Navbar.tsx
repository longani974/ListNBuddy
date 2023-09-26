import { useRecoilValue } from "recoil";
import useLogout from "../hooks/useLogout";
import { userState } from "../atoms/userAtoms";
import { useEffect, useState } from "react";
import useInvitations from "../hooks/useInvitations";

type NavbarProps = {
    // props here
};

const Navbar: React.FC<NavbarProps> = () => {
    const [notifications, setNotifications] = useState<number>(0);
    const logout = useLogout();
    const { isLogin } = useRecoilValue(userState);

    const waitingInvitations = useInvitations("waiting");

    useEffect(() => {
        setNotifications(waitingInvitations?.length);
    }, [waitingInvitations?.length]);

    return (
        <div className="navbar bg-base-100">
            {/* {isLogin && ( */}
                <div className="flex-none lg:hidden">
                    <label
                        htmlFor="my-drawer-2"
                        className="btn btn-square btn-ghost"
                    >
                        <div className="indicator ">
                            {notifications > 0 && (
                                <span className="indicator-item text-gray-400 z-0">
                                    {notifications}
                                </span>
                            )}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-5 h-5 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </div>
                    </label>
                </div>
            {/* )} */}
            <div className="flex-1">
                <h1>ListnBuddy</h1>
            </div>
            <div className="flex-none">
                {isLogin && (
                    <button className="btn btn-ghost" onClick={logout}>
                        Se déconnecter
                    </button>
                )}
            </div>
        </div>
    );
};
export default Navbar;
