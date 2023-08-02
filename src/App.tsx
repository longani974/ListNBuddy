// import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "./atoms/userAtoms";
import Table from "./components/Table/Table";
import Drawer from "./components/Drawer";
import ModalMyInvitations from "./components/Table/ModalMyInvitations";
import useInvitations from "./hooks/useInvitations";
import ModalMyLists from "./components/Table/ModalMyLists";
import { listToShow } from "./atoms/listToShow";
import ModalForgetPassword from "./components/ModalForgetPasword";
import { Lists } from "./types/dbPocketbasetypes";
import ModalMyNewList from "./components/Table/ModalMyNewList";
import { useClickModal } from "./hooks/useClickModal";
import { onlineStatusState } from "./atoms/onlineStatusAtoms";
import { useEffect } from "react";
import ErrorToast from "./components/ErrorToast";

export default function App() {
    const acceptInvitations = useInvitations("accept");

    const { isLogin } = useRecoilValue(userState);
    const { indexListToShow } = useRecoilValue(listToShow);
    const { clickModal } = useClickModal();

    const [onlineStatus, setOnlineStatus] = useRecoilState(onlineStatusState);

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

            {!isLogin && <Auth />}
            {!isLogin && <ModalForgetPassword />}

            <Drawer>
                {isLogin && (
                    <div>
                        <div className="overflow-x-auto w-full">
                            {acceptInvitations.length ? (
                                // TODO: fix this
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                <Table
                                    {...(acceptInvitations[indexListToShow]
                                        .expand.list as Lists)}
                                />
                            ) : (
                                <label
                                    htmlFor="articleModal"
                                    onClick={() => {
                                        clickModal("myNewListModal");
                                    }}
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
                )}
            </Drawer>
            {!onlineStatus && (
                <ErrorToast message="Vous avez perdu votre connection internet.Les fonctionnalitées habituelles ne sont plus disponibles" />
            )}
        </>
    );
}
