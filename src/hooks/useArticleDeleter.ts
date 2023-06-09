import { useMutation } from "@tanstack/react-query";
import { useListChangedSignaler } from "./useListChangedSignaler";
import pb from "../lib/pocketbase";

export const useArticleDeleter = (articleId: string, listId: string, articlesList: string[]) => {
    const deleteArticle = async () => {
        return await pb.collection("articles").delete(articleId);
    };

    const signalListChanged = useListChangedSignaler(listId);

    const mutateArticle = useMutation(deleteArticle, {
        onSuccess: () => {
            const articles = articlesList.filter(
                (article) => article !== articleId
            );
            signalListChanged(articles);
        },
    });
    return mutateArticle;
};
