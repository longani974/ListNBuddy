import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { Lists } from "../types/dbPocketbasetypes";

interface Article {
    name: string;
    quantity: string;
    isBuyed: boolean;
    addBy: string|undefined;
    list: Lists["id"]
}

export const useNewArticleAdder = (
    article: Article,
) => {
    const addNewArticle = async () => {
        return await pb.collection("articles").create(article);
    };
    const mutateArticle = useMutation(addNewArticle, {
        onSuccess: () => {
            console.log("article added");
            // const articles = [...articlesList, res.id];
            // signalListChanged(articles);
        },
    });

    return mutateArticle;
};
