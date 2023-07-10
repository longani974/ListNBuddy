import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
interface Article {
    id: string;
    name?: string;
    quantity?: string;
    isBuyed?: boolean;
    isBuyedBy?: string;
}

export const useArticleModifier = (article: Article) => {
    const updateArticle = async () => {
        return await pb.collection("articles").update(article.id, {
            ...article,
        });
    };

    const mutateArticle = useMutation(updateArticle, {
        onSuccess: () => {
            console.log("article updated");
            // signalListChanged();
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
