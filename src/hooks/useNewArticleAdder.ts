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

export const useNewArticleAdder = () => {
    const addNewArticle = async (article: Article) => {
        return await pb.collection("articles").create(article);
    };
    const mutateArticle = useMutation(addNewArticle);

    return mutateArticle;
};
