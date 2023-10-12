// import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "./atoms/userAtoms";
import { authFormState } from "./atoms/showAuthFormAtoms";
import Table from "./components/Table/Table";
import Drawer from "./components/Drawer";
import ModalMyInvitations from "./components/Table/ModalMyInvitations";
import useInvitations from "./hooks/useInvitations";
import ModalMyLists from "./components/Table/ModalMyLists";
import { listToShow } from "./atoms/listToShow";
import ModalForgetPassword from "./components/ModalForgetPasword";
import { Lists } from "./types/dbPocketbasetypes";
import ModalMyNewList from "./components/Table/ModalMyNewList";
import { onlineStatusState } from "./atoms/onlineStatusAtoms";
import { useEffect } from "react";
import ErrorToast from "./components/ErrorToast";
import { useLocalStorage } from "usehooks-ts";

export default function App() {
    // const [localStorageLists, setLocalStorageLists] = useState<Lists []>([])
    // const localStorageLists = useReadLocalStorage<Lists[]>("lists");
    const [localStorageLists, setLocalStorageLists] = useLocalStorage<Lists[]>(
        "listnbuddy_lists",
        []
    );

    const acceptInvitations = useInvitations("accept");

    const { isLogin } = useRecoilValue(userState);
    const { indexListToShow } = useRecoilValue(listToShow);
    const { showAuthForm } = useRecoilValue(authFormState);
    // const { clickModal } = useClickModal();

    const [onlineStatus, setOnlineStatus] = useRecoilState(onlineStatusState);

    // if localStorageLists is null, set it to an empty array in a useEffect
    useEffect(() => {
        if (localStorageLists === null) {
            setLocalStorageLists([]);
        }
    }, [localStorageLists, setLocalStorageLists]);

    // This code is used to detect if the user is online or offline.
    // The code uses the online and offline events to detect the user's online status.
    // The code also updates the online status in the background.
    useEffect(() => {
        // Create a function that sets the online status
        // and updates the ui
        const updateOnlineStatus = (event: Event) => {
            const isOnline = event.type === "online";
            setOnlineStatus(isOnline);
        };

        // Listen for the online and offline events
        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        // Unsubscribe from the events when the component is removed
        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, [setOnlineStatus]);

    return (
        <>
            <Navbar />

            {showAuthForm && <Auth />}
            {showAuthForm && <ModalForgetPassword />}

            {!showAuthForm && (
                <Drawer>
                    {/* {isLogin && ( */}
                    <div>
                        <div className="overflow-x-auto w-full">
                            {!isLogin && localStorageLists !== null && (
                                // FIXME:
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                <Table
                                    {...(localStorageLists[
                                        indexListToShow
                                    ] as Lists)}
                                />
                            )}

                            {acceptInvitations.length > 0 && (
                                // TODO: fix this
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                <Table
                                    {...(acceptInvitations[indexListToShow]
                                        .expand.list as Lists)}
                                />
                            )}

                            {!acceptInvitations.length &&
                                !localStorageLists?.length && (
                                    <label
                                        htmlFor="myNewListModal"
                                        // onClick={() => {
                                        //     clickModal("myNewListModal");
                                        // }}
                                        className="btn"
                                    >
                                        Créer votre première liste
                                    </label>
                                )}
                        </div>
                        <ModalMyInvitations />
                        <ModalMyLists />
                        <ModalMyNewList />
                    </div>
                    {/* )} */}

                    <a
                        href="sms:?body=Salut%20!%20%F0%9F%9B%92%20J'utilise%20ListnBuddy%2C%20une%20super%20appli%20pour%20partager%20nos%20listes%20de%20courses%20en%20temps%20r%C3%A9el.%20Rejoins-moi%20sur%20ListnBuddy%20en%20cliquant%20sur%20ce%20lien%3A%20https%3A%2F%2Fwww.app.listnbuddy.com.%20On%20peut%20g%C3%A9rer%20nos%20courses%20ensemble%20et%20voir%20les%20mises%20%C3%A0%20jour%20en%20direct.%20%F0%9F%8E%89"
                        target="_blank"
                        rel="noreferrer"
                        className="text-center text-gray-400"
                    >
                        Pocketbase
                    </a>
                </Drawer>
            )}
            {!onlineStatus && (
                <ErrorToast message="Vous avez perdu votre connection internet.Les fonctionnalitées habituelles ne sont plus disponibles" />
            )}
        </>
    );
}
