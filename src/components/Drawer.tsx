import React, { useCallback, useEffect } from "react";
import { userState } from "../atoms/userAtoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import pb from "../lib/pocketbase";
import { Invitations, invitationState } from "../atoms/invitationAtoms";
import { useEffectOnce } from "../hooks/useEffectOnce";
// import { themeChange } from "theme-change";
import useInvitations from "../hooks/useInvitations";
import { useClickModal } from "../hooks/useClickModal";
import InstallPWA from "./InstallPWA";
import useTheme from "../hooks/useTheme";
import { authFormState } from "../atoms/showAuthFormAtoms";
import useLogout from "../hooks/useLogout";
import AdSense from "./ads/AdSense";

type DrawerProps = {
    children: React.ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({ children }) => {
    const { toggleTheme, isChecked } = useTheme();

    const { userId, isLogin } = useRecoilValue(userState);
    const setInvitations = useSetRecoilState(invitationState);
    const setAuthFormState = useSetRecoilState(authFormState);

    const waitingInvitations = useInvitations("waiting");

    const { clickModal } = useClickModal();

    const logout = useLogout();

    const getInvitedLists = useCallback(async () => {
        {
            try {
                console.log("getInvitedLists");
                const resultList = await pb
                    .collection("invitations")
                    .getFullList(200, {
                        sort: "created",
                        filter: `user.id = "${userId}"`,
                        expand: "user, list, by",
                        $autoCancel: false, // TODO: I don't know if it's useful
                    });
                setInvitations({ invitations: resultList as Invitations[] });
            } catch (e) {
                console.log(e);
            }
        }
    }, [setInvitations, userId]);

    useEffect(() => {
        userId?.length && getInvitedLists();
    }, [getInvitedLists, userId]);
    // utiliser useEffectOnce pour ne pas recharger les invitations à chaque fois que le composant est monté
    // car en dirait que unsubscribe ne fonctionne pas correctement ou pas assez rapidement
    // ClientResponseError 0: Something went wrong while processing your request.

    useEffectOnce(() => {
        const realTime = async () => {
            try {
                await pb.collection("invitations").subscribe("*", function () {
                    // laisser un laps de temps avant de recharger les invitations
                    // car il faut attendre que la base de données soit mise à jour
                    setTimeout(() => {
                        getInvitedLists();
                    }, 1000);
                });
            } catch (e) {
                console.log(e);
            }
        };

        isLogin && realTime();

        return () => {
            pb.collection("invitations").unsubscribe("*");
        };
    });

    return (
        <>
            {/* {isLogin && ( */}
            <div className="drawer lg:drawer-open">
                <input
                    id="my-drawer-2"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content">
                    {/* <!-- Page content here --> */}
                    {children}
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="my-drawer-2"
                        className="drawer-overlay"
                    ></label>
                    <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                        {/* <!-- Sidebar content here --> */}
                        <li
                            className="bg-transparent pt-1 pb-1"
                            onClick={() => clickModal("myInvitationModal")}
                        >
                            {/* <div className="indicator">
                                    {waitingInvitations?.length > 0 && (
                                        <span className="indicator-item indicator-middle text-gray-400 h-6 absolute">
                                            {waitingInvitations?.length}
                                        </span>
                                    )} */}

                            <label htmlFor="my-drawer-2">
                                <a
                                // onClick={() =>
                                //     clickModal("myInvitationModal")
                                // }
                                >
                                    Mes invitations{" "}
                                    <span className="relative bottom-2 right-2">
                                        {!!waitingInvitations?.length}
                                    </span>
                                </a>
                            </label>
                            {/* </div> */}
                        </li>
                        <li
                            className="bg-transparent pt-1 pb-1"
                            onClick={() => clickModal("myListsModal")}
                        >
                            <label htmlFor="my-drawer-2">Mes listes</label>
                        </li>
                        <li
                            className="bg-transparent pt-1 pb-1"
                            onClick={() => clickModal("myNewListModal")}
                        >
                            <label htmlFor="my-drawer-2">
                                Ajouter une liste
                            </label>
                        </li>
                        {!isLogin && (
                            <>
                                <li
                                    className="bg-transparent pt-1 pb-1"
                                    onClick={() =>
                                        setAuthFormState({
                                            showAuthForm: true,
                                            authMode: "signup",
                                        })
                                    }
                                >
                                    <label htmlFor="my-drawer-2">
                                        Créer un compte
                                    </label>
                                </li>
                                <li
                                    className="bg-transparent pt-1 pb-1"
                                    onClick={() =>
                                        setAuthFormState({
                                            showAuthForm: true,
                                            authMode: "login",
                                        })
                                    }
                                >
                                    <label htmlFor="my-drawer-2">
                                        Se connecter
                                    </label>
                                </li>
                            </>
                        )}
                        {isLogin && (
                            <li
                                className="bg-transparent pt-1 pb-1"
                                onClick={logout}
                            >
                                <label htmlFor="my-drawer-2">
                                    Se déconnecter
                                </label>
                            </li>
                        )}

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Light</span>
                                <input
                                    type="checkbox"
                                    className="toggle"
                                    checked={isChecked}
                                    onChange={toggleTheme}
                                />
                                <span className="label-text">Dark</span>
                            </label>
                        </div>

                        <li className="mt-2">
                            <InstallPWA />
                        </li>
                    </ul>
                    <AdSense slot="9500691355" format="auto" />
                </div>
            </div>
            {/* )} */}
        </>
    );
};
export default Drawer;
