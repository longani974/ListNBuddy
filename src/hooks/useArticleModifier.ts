import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { useRecoilValue } from "recoil";
import { onlineStatusState } from "../atoms/onlineStatusAtoms";
import { ClientResponseError } from "pocketbase";
interface Article {
    id: string;
    name?: string;
    quantity?: string;
    isBuyed?: boolean;
    isBuyedBy?: string;
    list?: string;
}

// define a custom hook that will update the article
export const useArticleModifier = () => {
    // get the online status
    const isOnline = useRecoilValue(onlineStatusState);

    // define the function that will update the article
    const updateArticle = async (article: Article) => {
        const aricleData = await pb
            .collection("articles")
            .update(article.id, {
                ...article,
            })
            return aricleData as Article;
    };

    // use the react-query mutation hook to update the article
    const mutateArticle = useMutation<Article, ClientResponseError, Article>(updateArticle, {
        onMutate: (data) => {
            console.log("onMutate")
            console.log(data)
            // if the user is offline, throw an error
            if (!isOnline) {
                throw new Error('Internet Disconnected');
            }
        },
        onSuccess: () => {
            console.log("success")
        },
        onError: (err) => {
            return err
        },
    });

    // return the mutation hook
    return mutateArticle;
};