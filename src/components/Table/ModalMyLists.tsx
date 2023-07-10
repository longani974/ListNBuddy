import { useRecoilValue, useSetRecoilState } from "recoil";
import useInvitations from "../../hooks/useInvitations";
import { listToShow } from "../../atoms/listToShow";
import { InvitationStatus, invitationState } from "../../atoms/invitationAtoms";
import pb from "../../lib/pocketbase";

type ModalMyListsProps = {
    //
};

const ModalMyLists: React.FC<ModalMyListsProps> = () => {
    const { invitations } = useRecoilValue(invitationState);

    const acceptedInvitations = useInvitations("accept");

    const setIndex = useSetRecoilState(listToShow);

    const handleStatusInvitation = async (
        listId: string,
        status: InvitationStatus
    ) => {
        const invitation = invitations.filter(
            (invitation) => invitation.list === listId
        )[0];

        await pb.collection("invitations").update(invitation.id, {
            status: status,
        });
    };

    return (
        <>
            {/* Put this part before </body> tag */}
            <input type="checkbox" id="myListsModal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label
                        htmlFor="myListsModal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">Mes Listes</h3>
                    <div className="py-4">
                        <div className="overflow-y-auto max-h-96">
                            {acceptedInvitations.map((invitation, index) => (
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
                                                {invitation.expand.list?.name}
                                            </span>
                                            <span className="text-xs">
                                                {"Envoyé par: " +
                                                    invitation.expand.by?.email}
                                            </span>
                                        </div>
                                        <div className="btn-group btn-group-horizontal">
                                            <button
                                                className="btn btn-square"
                                                onClick={() => {
                                                    setIndex({
                                                        indexListToShow: index,
                                                    });
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                >
                                                    <circle
                                                        cx="256"
                                                        cy="256"
                                                        r="64"
                                                        fill="currentColor"
                                                    ></circle>
                                                    <path
                                                        d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76zM256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96z"
                                                        fill="currentColor"
                                                    ></path>
                                                </svg>
                                            </button>
                                            <button
                                                className="btn btn-square btn-ghost"
                                                onClick={() =>
                                                    handleStatusInvitation(
                                                        invitation.list,
                                                        "waiting"
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ModalMyLists;
