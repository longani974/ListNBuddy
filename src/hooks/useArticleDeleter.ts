import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";

export const useArticleDeleter = () => {
    const deleteArticle = async (articleId: string) => {
        return await pb.collection("articles").delete(articleId);
    };


    const mutateArticle = useMutation(deleteArticle);

    return mutateArticle;
};
