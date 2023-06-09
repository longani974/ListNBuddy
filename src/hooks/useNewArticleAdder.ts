import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { useListChangedSignaler } from "./useListChangedSignaler";

interface Article {
    name: string;
    quantity: string;
    isBuyed: boolean;
    addBy: string|undefined;
}

export const useNewArticleAdder = (
    article: Article,
    listId: string,
    articlesList: string[]
) => {
    const addNewArticle = async () => {
        return await pb.collection("articles").create(article);
    };

    const signalListChanged = useListChangedSignaler(listId);

    const mutateArticle = useMutation(addNewArticle, {
        onSuccess: (res) => {
            const articles = [...articlesList, res.id];
            signalListChanged(articles);
        },
    });

    return mutateArticle;
};
