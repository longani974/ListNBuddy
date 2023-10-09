import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { Lists } from "../types/dbPocketbasetypes";

interface Article {
    name: string;
    quantity?: string | undefined;
    isBuyed: boolean;
    addBy: string | undefined;
    list: Lists["id"];
}

export const useNewArticleAdder = (onSuccessFn?: { (): void }) => {
    const addNewArticle = async (article: Article) => {
        return await pb.collection("articles").create(article);
    };
    const mutateArticle = useMutation(addNewArticle, {
        onSuccess: () => {
            console.log("article added");
            if (onSuccessFn) onSuccessFn();
        },
    });

    return mutateArticle;
};
