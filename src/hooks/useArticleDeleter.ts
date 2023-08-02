import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";

export const useArticleDeleter = (articleId: string) => {
    const deleteArticle = async () => {
        return await pb.collection("articlesdz").delete(articleId);
    };


    const mutateArticle = useMutation(deleteArticle, {
        onSuccess: (data) => {
            console.log(data)
        },
        onError: (error) => {
            console.log(error)
        }
    });
    return mutateArticle;
};
