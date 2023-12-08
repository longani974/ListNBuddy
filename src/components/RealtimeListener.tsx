import React, { useEffect, useRef, useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { articlesState } from "../atoms/articlesAtoms";
import pb from "../lib/pocketbase";
import { Article } from "../types/dbPocketbasetypes";
import useInvitations from "../hooks/useInvitations";
import { listToShow } from "../atoms/listToShow";

type RealtimeListenerProps = {
    //
};

const RealtimeListener: React.FC<RealtimeListenerProps> = () => {
    const [listId, setListId] = useState<string>("");
    const acceptInvitations = useInvitations("accept");
    const { indexListToShow } = useRecoilValue(listToShow);

    const isSubscribed = useRef(false); // Créer un useRef pour vérifier si vous êtes déjà abonné ou non

    useEffect(() => {
        console.log(indexListToShow)
        console.log(acceptInvitations)
        setListId(acceptInvitations[indexListToShow]?.list);
        return () => {
            console.log("unmount");
        };
    }, [acceptInvitations, indexListToShow]);

    // useRecoilCallback is used here to ensure that the callback function always has the most recent Recoil state, even if it's used asynchronously.
    // This prevents potential bugs that could occur if the state was captured at the time the callback was defined, which could be stale by the time the callback is executed.
    // If not using useRecoilCallback, the data desappears and the Table desappears too.
    const updateArticles = useRecoilCallback(
        ({ snapshot, set }) =>
            async ({ action, record }) => {
                const loadable = snapshot.getLoadable(articlesState);
                if (loadable.state === "hasValue") {
                    const articles = loadable.contents.articles; // Get the articles from articlesState
                    let newArticlesCopy;
                    switch (action) {
                        case "update": {
                            newArticlesCopy = JSON.parse(
                                JSON.stringify([...articles])
                            );
                            const index = newArticlesCopy.findIndex(
                                (article: { id: string }) =>
                                    article.id === record.id
                            );
                            newArticlesCopy[index] = record as Article;
                            set(articlesState, { articles: newArticlesCopy });
                            break;
                        }
                        case "create": {
                            newArticlesCopy = JSON.parse(
                                JSON.stringify([...articles])
                            );
                            newArticlesCopy.push(record as Article);
                            set(articlesState, { articles: newArticlesCopy });
                            break;
                        }
                        case "delete": {
                            newArticlesCopy = JSON.parse(
                                JSON.stringify([...articles])
                            );
                            const deleteIndex = newArticlesCopy.findIndex(
                                (article: { id: string }) =>
                                    article.id === record.id
                            );
                            newArticlesCopy.splice(deleteIndex, 1);
                            set(articlesState, { articles: newArticlesCopy });
                            break;
                        }
                    }
                }
            }
    );

    // useEffect is used here to subscribe to changes in the articles collection when the component mounts and the listId changes.
    // This ensures that the subscription only happens once, preventing unnecessary network requests and potential memory leaks.
    // The isSubscribed ref is used to ensure that the subscription only happens once, even if the component is unmounted and remounted.
    useEffect(() => {
        const realTime = async () => {
            if (!isSubscribed.current) {
                isSubscribed.current = true;
                await pb.collection("articles").subscribe("*", updateArticles);
            }
        };
        listId?.length && realTime();

        // the unsubscribe is done in the return of the next useEffect
    }, [listId?.length, updateArticles]);

    // This useEffect is used to unsubscribe from changes in the articles collection when the component unmounts.
    // This is important for preventing memory leaks that could occur if the component was removed from the DOM but the subscription was still active.
    // If we unsubscribe in the same useEffect as the subscription, the subscription will be removed immediately after it's created, which is not what we want.
    // And when we click on the checkbox isBuyed, we unsubscribe and the ui is not updated
    useEffect(() => {
        return () => {
            pb.collection("articles").unsubscribe("*");
        };
    }, []);

    return null;
};
export default RealtimeListener;
