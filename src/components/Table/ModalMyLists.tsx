import { useRecoilValue, useSetRecoilState } from "recoil";
import useInvitations from "../../hooks/useInvitations";
import { listToShow } from "../../atoms/listToShow";
import { useHandleStatusInvitation } from "../../hooks/useHandleStatusInvitation";
import { onlineStatusState } from "../../atoms/onlineStatusAtoms";
import { userState } from "../../atoms/userAtoms";
import { useLocalStorage } from "usehooks-ts";
import { Lists } from "../../types/dbPocketbasetypes";
import { useClickModal } from "../../hooks/useClickModal";
import AuthButtons from "../AuthButtons";
// import { Adsense } from "@ctrl/react-adsense";

type ModalMyListsProps = {
    //
};

const ModalMyLists: React.FC<ModalMyListsProps> = () => {
    const acceptedInvitations = useInvitations("accept");

    const setIndex = useSetRecoilState(listToShow);

    const { mutateAsync } = useHandleStatusInvitation();

    const isOnline = useRecoilValue(onlineStatusState);
    const { isLogin } = useRecoilValue(userState);

    const [localStorageLists, setLocalStorageLists] = useLocalStorage<Lists[]>(
        "listnbuddy_lists",
        []
    );

    const { clickModal } = useClickModal();
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
                    <h3 className="text-lg font-bold">Mes listes</h3>

                    {!isLogin && (
                        <>
                            <div className="alert">
                                Vous n'êtes pas connecté, certaines
                                fonctionnalités ne sont pas disponibles. Tel que
                                le partage de listes. Vos listes seront
                                disponibles uniquement sur cet appareil.
                            </div>

                            <div className="py-4">
                                <div className="overflow-y-auto max-h-96">
                                    {localStorageLists.map((list, index) => (
                                        <div
                                            key={list.id}
                                            className="flex flex-col mb-2"
                                        >
                                            {index > 0 && (
                                                <div className="divider"></div>
                                            )}

                                            <div className="flex flex-row justify-between text-left">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">
                                                        {list.name}
                                                    </span>
                                                </div>
                                                <div className="btn-group btn-group-horizontal">
                                                    <button
                                                        className={`btn btn-square ${
                                                            !isOnline &&
                                                            "btn-disabled"
                                                        }`}
                                                        onClick={() => {
                                                            setIndex({
                                                                indexListToShow:
                                                                    index,
                                                            });
                                                            clickModal(
                                                                "myListsModal"
                                                            );
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
                                                        className={`btn btn-square btn-ghost`}
                                                        onClick={() => {
                                                            const listId =
                                                                list.id;

                                                            setLocalStorageLists(
                                                                localStorageLists.filter(
                                                                    (list) =>
                                                                        list.id !==
                                                                        listId
                                                                )
                                                            );
                                                        }}
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

                                    {localStorageLists.length === 0 && (
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-sm">
                                                Vous n'avez pas encore de listes
                                            </span>
                                        </div>
                                    )}

                                    <AuthButtons />
                                </div>
                            </div>
                        </>
                    )}

                    {!isOnline && isLogin && (
                        <div className="alert alert-error">
                            Vous êtes hors ligne, vous ne pouvez pas changer ou
                            supprimer une liste.
                        </div>
                    )}
                    {isLogin && (
                        <div className="py-4">
                            <div className="overflow-y-auto max-h-96">
                                {acceptedInvitations.map(
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
                                                            invitation.expand
                                                                .list?.name
                                                        }
                                                    </span>
                                                    <span className="text-xs">
                                                        {"Envoyé par: " +
                                                            invitation.expand.by
                                                                ?.email}
                                                    </span>
                                                </div>
                                                <div className="btn-group btn-group-horizontal">
                                                    <button
                                                        className={`btn btn-square ${
                                                            !isOnline &&
                                                            "btn-disabled"
                                                        }`}
                                                        onClick={() => {
                                                            setIndex({
                                                                indexListToShow:
                                                                    index,
                                                            });
                                                            clickModal("myListsModal")
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
                                                        className={`btn btn-square btn-ghost ${
                                                            !isOnline &&
                                                            "btn-disabled"
                                                        }`}
                                                        onClick={() =>
                                                            mutateAsync({
                                                                listId: invitation.list,
                                                                status: "waiting",
                                                            })
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

                                {acceptedInvitations.length === 0 && (
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="text-sm">
                                            Vous n'avez pas encore de listes
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* <Adsense
                        slot="2212194431"
                        client="ca-pub-1943996794458760"
                        format="auto"
                    /> */}
                </div>
            </div>
        </>
    );
};
export default ModalMyLists;
