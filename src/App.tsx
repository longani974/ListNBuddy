import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { useRecoilValue } from "recoil";
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

export default function App() {
    const acceptInvitations = useInvitations("accept");

    const { isLogin } = useRecoilValue(userState);
    const { indexListToShow } = useRecoilValue(listToShow);
    const { clickModal } = useClickModal();

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
        </>
    );
}
