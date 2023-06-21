import React from "react";
import { userState } from "../atoms/userAtoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import pb from "../lib/pocketbase";
import { Invitations, invitationState } from "../atoms/invitationAtoms";
import { useEffectOnce } from "../hooks/useEffectOnce";

type DrawerProps = {
    children: React.ReactNode;
};

// TODO: Try to find a way to open the modal from the drawer without accessing the DOM
const clickModal = (modalId: string) => {
    const modal = document.getElementById(modalId);
    // Code to open the modal
    modal?.click();
};

const Drawer: React.FC<DrawerProps> = ({ children }) => {
    const { userId, isLogin } = useRecoilValue(userState);
    const { invitations } = useRecoilValue(invitationState);
    const setInvitations = useSetRecoilState(invitationState);

    const getInvitedLists = async () => {
        {
            try {
                const resultList = await pb
                    .collection("invitations")
                    .getFullList(200, {
                        sort: "created",
                        filter: `user.id = "${userId}"`,
                        expand: "user, list, by",
                    });
                setInvitations({ invitations: resultList as Invitations[]  });
                console.log(resultList)
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
                            {invitations?.length > 0 && (
                                <span className="indicator-item indicator-middle text-gray-400 h-6">
                                    {invitations?.length}
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
                        <a>Mes listes</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};
export default Drawer;
