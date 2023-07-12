import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "./atoms/userAtoms";
import Table from "./components/Table/Table";
import pb from "./lib/pocketbase";
import Drawer from "./components/Drawer";
import ModalMyInvitations from "./components/Table/ModalMyInvitations";
import { invitationState } from "./atoms/invitationAtoms";
import { useEffect, useState } from "react";
import useInvitations from "./hooks/useInvitations";
import ModalMyLists from "./components/Table/ModalMyLists";
import { listToShow } from "./atoms/listToShow";
import ModalForgetPassword from "./components/ModalForgetPasword";
import { Article, Lists } from "./types/dbPocketbasetypes";
import { articlesState } from "./atoms/articlesAtoms";
import { useInvitateUser } from "./hooks/useInvitateUser";
import ModalMyNewList from "./components/Table/ModalMyNewList";
import { useClickModal } from "./hooks/useClickModal";

export default function App() {
    const [listId, setListId] = useState<string>("");

    const acceptInvitations = useInvitations("accept");

    const { isLogin, userId } = useRecoilValue(userState);
    const { invitations } = useRecoilValue(invitationState);
    const { indexListToShow } = useRecoilValue(listToShow);
    const { articles } = useRecoilValue(articlesState);
    const setArticles = useSetRecoilState(articlesState);

    const setInvitations = useSetRecoilState(invitationState);

    const inviteUser = useInvitateUser();

    const { clickModal } = useClickModal();

    useEffect(() => {
        setListId(acceptInvitations[indexListToShow]?.list);
    }, [acceptInvitations, indexListToShow]);

    // realtime: subscribe to changes in the articles collection
    useEffect(() => {
        // Subscribe to changes only in the specified record
        const realTime = async () => {
            await pb
                .collection("articles")
                .subscribe("*", async function ({ action, record }) {
                    if (action === "update") {
                        const newArticlesCopy = JSON.parse(
                            JSON.stringify([...articles])
                        );

                        const index = newArticlesCopy.findIndex(
                            (article: { id: string }) =>
                                article.id === record.id
                        );

                        newArticlesCopy[index] = record as Article;

                        setArticles({ articles: newArticlesCopy });
                    }

                    if (action === "create") {
                        const newArticlesCopy = JSON.parse(
                            JSON.stringify([...articles])
                        );

                        newArticlesCopy.push(record as Article);

                        setArticles({ articles: newArticlesCopy });
                    }

                    if (action === "delete") {
                        const newArticlesCopy = JSON.parse(
                            JSON.stringify([...articles])
                        );

                        console.log(record.id);

                        const index = newArticlesCopy.findIndex(
                            (article: { id: string }) =>
                                article.id === record.id
                        );
                        console.log(index);

                        newArticlesCopy.splice(index, 1);

                        setArticles({ articles: newArticlesCopy });
                    }
                });
        };

        // Check if listId has a length before subscribing to changes
        listId?.length && realTime();

        // Unsubscribe from the record subscription when the component unmounts
        return () => {
            pb.collection("articles").unsubscribe("*");
        };
    }, [
        articles,
        indexListToShow,
        invitations,
        listId,
        setArticles,
        setInvitations,
    ]);

    const createList = async () => {
        // example create data
        const data = {
            name: "testali",
            createBy: userId,
        };

        const recordList = await pb.collection("lists").create(data);
        return recordList as Lists;
    };

    const createFirstList = async () => {
        const list = await createList();
        inviteUser.mutateAsync({
            id: list.id,
            email: pb.authStore?.model?.email,
            status: "accept",
        });
    };

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
