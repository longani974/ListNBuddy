import React from "react";
import { userState } from "../atoms/userAtoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import pb from "../lib/pocketbase";
import { Invitations, invitationState } from "../atoms/invitationAtoms";
import { useEffectOnce } from "../hooks/useEffectOnce";
import useInvitations from "../hooks/useInvitations";
import { useClickModal } from "../hooks/useClickModal";

type DrawerProps = {
    children: React.ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({ children }) => {
    const { userId, isLogin } = useRecoilValue(userState);
    const setInvitations = useSetRecoilState(invitationState);

    const waitingInvitations = useInvitations("waiting");

    const { clickModal } = useClickModal();


    const getInvitedLists = async () => {
        {
            try {
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
    };

    useEffectOnce(() => {
        userId?.length && getInvitedLists();
    });
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
                        <div className="indicator">
                            {waitingInvitations?.length > 0 && (
                                <span className="indicator-item indicator-middle text-gray-400 h-6">
                                    {waitingInvitations?.length}
                                </span>
                            )}

                            <label htmlFor="my-drawer-2">
                                <a
                                    onClick={() =>
                                        clickModal("myInvitationModal")
                                    }
                                >
                                    Mes invitations
                                </a>
                            </label>
                        </div>
                    </li>
                    <li>
                        <label htmlFor="my-drawer-2">
                            <a onClick={() => clickModal("myListsModal")}>
                                Mes Listes
                            </a>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    );
};
export default Drawer;
