import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { useRecoilValue } from "recoil";
import { onlineStatusState } from "../atoms/onlineStatusAtoms";
interface Article {
    id: string;
    name?: string;
    quantity?: string;
    isBuyed?: boolean;
    isBuyedBy?: string;
    list?: string;
}

// define a custom hook that will update the article
export const useArticleModifier = (article: Article) => {
    // get the online status
    const isOnline = useRecoilValue(onlineStatusState);

    // define the function that will update the article
    const updateArticle = async () => {
        return await pb
            .collection("articles")
            .update(article.id, {
                ...article,
            })
    };

    // use the react-query mutation hook to update the article
    const mutateArticle = useMutation(updateArticle, {
        onMutate: () => {
            // if the user is offline, throw an error
            if (!isOnline) {
                throw new Error('Internet Disconnected');
            }
        },
        onSuccess: () => {
            console.log("article updated");
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => {
            console.log("onSettled");
        },
    });

    // return the mutation hook
    return mutateArticle;
};