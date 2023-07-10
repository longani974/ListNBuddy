import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";

export const useArticleDeleter = (articleId: string) => {
    const deleteArticle = async () => {
        return await pb.collection("articles").delete(articleId);
    };


    const mutateArticle = useMutation(deleteArticle, {
        onSuccess: () => {
            console.log("article deleted")
        },
    });
    return mutateArticle;
};
