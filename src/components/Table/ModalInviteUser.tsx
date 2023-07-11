import React, { useState } from "react";
// import { Article } from "../../types/dbPocketbasetypes";
import { useInvitateUser } from "../../hooks/useInvitateUser";

type ModalInviteUserProps = {
    listId: string;
};

const ModalInviteUser: React.FC<ModalInviteUserProps> = ({
    listId,
}) => {
    // const { userId } = useRecoilValue(userState);

    const [email, setEmail] = useState<string>("");

    const listModifier = useInvitateUser();

    const handleInviteUser = () => {
        listModifier.mutateAsync({ id: listId, email: email, status: "waiting" });
    };

    return (
        <>
            {/* Put this part before </body> tag */}
            <input
                type="checkbox"
                id="inviteUserModal"
                className="modal-toggle"
            />
            <div className="modal">
                <div className="modal-box relative">
                    <label
                        htmlFor="inviteUserModal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">Inviter une personne</h3>
                    <div className="py-4">
                        <form className="flex flex-col">
                            <label className="label">
                                <span className="label-text">
                                    Email de l'invité
                                </span>
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="input input-bordered w-100%"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </form>

                        <label
                            htmlFor="inviteUserModal"
                            className="btn btn-primary mt-4 w-full"
                            onClick={handleInviteUser}
                        >
                            Inviter
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ModalInviteUser;
