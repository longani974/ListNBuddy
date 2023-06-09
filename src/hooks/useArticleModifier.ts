import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { useListChangedSignaler } from "./useListChangedSignaler";
// import { Article } from "../types/dbPocketbasetypes";

// type ArticleModifier = {
//     article: Article | null;
//     listId: string;
// };
interface Article {
    id: string;
    name: string;
    quantity: string;
}

export const useArticleModifier = (article: Article, listId: string) => {
    const updateArticle = async () => {
        return await pb.collection("articles").update(article.id, {
            name: article.name,
            quantity: article.quantity,
        });
    };

    const signalListChanged = useListChangedSignaler(listId);

    const mutateArticle = useMutation(updateArticle, {
        onSuccess: () => {
            console.log("updateArticle");
            signalListChanged();
        },
        onError: () => {
            console.log("error");
        },
        onSettled: () => {
            console.log("onSettled");
        },
    });

    return mutateArticle;
};
