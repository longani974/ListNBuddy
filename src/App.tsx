import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "./atoms/userAtoms";
import Table from "./components/Table/Table";
import useGetLastListAndRealTime from "./hooks/useGetLastListAndRealTime";
import pb from "./lib/pocketbase";
import Drawer from "./components/Drawer";
import ModalMyInvitations from "./components/Table/ModalMyInvitations";
import { Invitations, invitationState } from "./atoms/invitationAtoms";
import { useEffect, useState } from "react";
import useInvitations from "./hooks/useInvitations";
import { set } from "react-hook-form";

export default function App() {
    const [listId, setListId] = useState<string>("");
    const { isLogin, userId } = useRecoilValue(userState);
    const acceptInvitations = useInvitations("accept");
    const setInvitations = useSetRecoilState(invitationState);
    const { invitations } = useRecoilValue(invitationState);


    useEffect(() => {
        setListId(acceptInvitations[0]?.list);
    }, [acceptInvitations]);

    // subscribe realtime pocketbase lists
    useEffect(() => {
        // Subscribe to changes only in the specified record
        const realTime = async () => {
            await pb.collection("lists").subscribe(listId, async function  (changes) {
                console.log(changes)
                // get last invitation
                const lastInvitation = await pb
                    .collection("invitations")
                    .getList(1, 1, {
                        filter: `user.id = "${pb.authStore.model?.id}" && status = "accept"`,
                        expand: "user,list.articles,by",
                    });
                
                // replace invitation matching with listId by lastInvitation in invitationState
                const index = invitations.findIndex(
                    (invitation) => invitation.list === listId
                );
                const newInvitations = [...invitations];
                newInvitations[index] = lastInvitation.items[0] as Invitations;
                setInvitations({ invitations: newInvitations });

            });
        };
        listId?.length && realTime();
        return () => {
            pb.collection("lists").unsubscribe(listId);
        }; // remove all 'RECORD_ID' subscriptions
    }, [invitations, listId, setInvitations]);

    // const { data } = useGetLastListAndRealTime();
    // const { invitations } = useRecoilValue(invitationState);

    // const [acceptInvitations, setAcceptInvitations] = useState<Invitations[]>(
    //     []
    // );
    // useEffect(() => {
    //     console.log("invitaion filter", invitations);
    //     setAcceptInvitations([
    //         ...invitations.filter(
    //             (invitation) => invitation.status === "accept"
    //         ),
    //     ]);
    // }, [ invitations]);

    // console.log(data)

    const addNewArticle = async () => {
        const recordArticle = await pb.collection("articles").create({
            name: "lait",
            quantity: "1l",
            isBuyed: false,
            addBy: userId,
            isBuyedBy: "",
        });
        // .then(
        //     async (res) =>
        //         await pb.collection("lists").update(listId, {
        //             modifiedArticle: Date.now(),
        //             articles: [...articlesList, res.id],
        //         })
        // );
        return recordArticle;
    };

    const createList = async (articleId: string) => {
        // example create data
        const data = {
            name: "testali",
            createBy: userId,
            participants: [userId],
            articles: [articleId],
            modifiedArticle: "test",
        };

        const recordList = await pb.collection("lists").create(data);
        return recordList;
        // await addNewArticle(recordList.id);
    };

    const createFirstList = async () => {
        const article = await addNewArticle();
        await createList(article.id);
    };

    return (
        <>
            <Navbar />

            {/* <h1>Logged In: {isLogin.toString()}</h1> */}
            {!isLogin && <Auth />}
            <Drawer>
                {isLogin && (
                    <div>
                        <div className="overflow-x-auto w-full">
                            {acceptInvitations.length ? (
                                <Table {...acceptInvitations[0].expand.list} />
                            ) : (
                                <label
                                    htmlFor="articleModal"
                                    onClick={() => {
                                        createFirstList();
                                    }}
                                    className="btn"
                                >
                                    Créer votre première liste
                                </label>
                            )}
                        </div>
                        <ModalMyInvitations />
                    </div>
                )}
            </Drawer>
        </>
    );
}
