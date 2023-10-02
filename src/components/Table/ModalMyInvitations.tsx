import useInvitations from "../../hooks/useInvitations";
import { useHandleStatusInvitation } from "../../hooks/useHandleStatusInvitation";
import { onlineStatusState } from "../../atoms/onlineStatusAtoms";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { userState } from "../../atoms/userAtoms";
import AuthButtons from "../AuthButtons";

type ModalInviteUserProps = {
    //
};

const ModalMyInvitations: React.FC<ModalInviteUserProps> = () => {
    const [showErrorAcceptInvitation, setShowErrorAcceptInvitation] =
        useState(false);
    const waitingInvitations = useInvitations("waiting");
    const acceptInvitations = useInvitations("accept");

    const { mutateAsync } = useHandleStatusInvitation();

    const isOnline = useRecoilValue(onlineStatusState);
    const { isLogin } = useRecoilValue(userState);

    return (
        <>
            {/* Put this part before </body> tag */}
            <input
                type="checkbox"
                id="myInvitationModal"
                className="modal-toggle"
            />
            <div className="modal">
                <div className="modal-box relative">
                    <label
                        htmlFor="myInvitationModal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">Mes invitations</h3>
                    {!isOnline && isLogin && (
                        <>
                            <div className="alert alert-error">
                                Vous êtes hors ligne, vous ne pouvez pas changer
                                le status de vos invitations.
                            </div>
                            {showErrorAcceptInvitation && (
                                <div className="alert alert-warning">
                                    Désolé vous ne pouvez pas être sur plus de 5
                                    listes à la fois. Pour en intégrer une
                                    nouvelle liste, vous devez d'abord quitter
                                    une liste.
                                </div>
                            )}
                            <div className="py-4">
                                <div className="overflow-y-auto max-h-96">
                                    {waitingInvitations.length > 0 &&
                                        waitingInvitations.map(
                                            (invitation, index) => (
                                                <div
                                                    key={invitation.id}
                                                    className="flex flex-col mb-2"
                                                >
                                                    {index > 0 && (
                                                        <div className="divider"></div>
                                                    )}

                                                    <div className="flex flex-row justify-between text-left">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold">
                                                                {
                                                                    invitation
                                                                        .expand
                                                                        .list
                                                                        ?.name
                                                                }
                                                            </span>
                                                            <span className="text-xs">
                                                                {"Envoyé par: " +
                                                                    invitation
                                                                        .expand
                                                                        .by
                                                                        ?.email}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`btn-group btn-group-horizontal ${
                                                                !isOnline &&
                                                                "btn-disabled"
                                                            }`}
                                                        >
                                                            <button
                                                                className="btn btn-square"
                                                                onClick={() =>
                                                                    acceptInvitations.length <
                                                                    5
                                                                        ? mutateAsync(
                                                                              {
                                                                                  listId: invitation.list,
                                                                                  status: "accept",
                                                                              }
                                                                          )
                                                                        : setShowErrorAcceptInvitation(
                                                                              true
                                                                          )
                                                                }
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 512 512"
                                                                >
                                                                    <path
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="32"
                                                                        d="M416 128L192 384l-96-96"
                                                                    ></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                className="btn btn-square btn-ghost"
                                                                onClick={() =>
                                                                    mutateAsync(
                                                                        {
                                                                            listId: invitation.list,
                                                                            status: "reject",
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 512 512"
                                                                >
                                                                    <path
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="32"
                                                                        d="M368 368L144 144"
                                                                    ></path>
                                                                    <path
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="32"
                                                                        d="M368 144L144 368"
                                                                    ></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    {!waitingInvitations.length && (
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-sm">
                                                Vous n'avez pas d'invitation
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {!isLogin && (
                        <>
                        <div className="alert alert-warning">
                            Vous devez être connecté pour recevoir des invitations.
                        </div>
                        <AuthButtons />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
export default ModalMyInvitations;
