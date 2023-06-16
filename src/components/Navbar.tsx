import { useRecoilValue } from "recoil";
import useLogout from "../hooks/useLogout";
import { userState } from "../atoms/userAtoms";

type NavbarProps = {
    // props here
};

const Navbar: React.FC<NavbarProps> = () => {
    const logout = useLogout();
    const { isLogin } = useRecoilValue(userState);
    return (
        <div className="navbar bg-base-100">
            <div className="flex-none">
                <label
                    htmlFor="my-drawer-2"
                    className="btn btn-square btn-ghost"
                >
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
                </label>
            </div>
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">ListMate</a>
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
