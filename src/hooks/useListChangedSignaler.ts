import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";

export const useListChangedSignaler = (listId: string) => {
    const signalListChange = async (articles?: string[]) => {
        const data = {
            modifiedArticle: Date.now(),
            ...(articles && { articles }),
        };
        return await pb.collection("lists").update(listId, data);
    };

    const mutateSignalListChange = useMutation(signalListChange,{
        onSuccess: () => {
            console.log("signal ok")
        },
        onError: () => {
            console.log("error");
        },
        onSettled: () => {
            console.log("sgnaling settled");
        },
    });

    const handleSignalListChange = (articles?: string[]) => {
        mutateSignalListChange.mutateAsync(articles);
    };

    return handleSignalListChange;
};