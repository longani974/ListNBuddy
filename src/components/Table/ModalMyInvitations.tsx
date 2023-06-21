// import React, { useEffect } from "react";
// import { Article } from "../../types/dbPocketbasetypes";
// import { useInvitateUser } from "../../hooks/useInvitateUser";
// import { userState } from "../../atoms/userAtoms";
import { useRecoilValue } from "recoil";
// import pb from "../../lib/pocketbase";
import { invitationState } from "../../atoms/invitationAtoms";

type ModalInviteUserProps = {
    //
};

const ModalMyInvitations: React.FC<ModalInviteUserProps> = () => {
    // const { userId, isLogin } = useRecoilValue(userState);
    const { invitations } = useRecoilValue(invitationState);

    // const listModifier = useInvitateUser({ id: listId, invited: invitedList, email: email, participants: participants });

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
                    <div className="py-4">
                        <div className="overflow-y-auto max-h-96">
                            {invitations.map((invitation, index) => (
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
                                                {invitation.expand.list.name}
                                            </span>
                                            <span className="text-xs">
                                                {"Envoyé par: " +
                                                    invitation.expand.by.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ModalMyInvitations;
