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

    const mutateSignalListChange = useMutation(signalListChange);

    const handleSignalListChange = (articles?: string[]) => {
        mutateSignalListChange.mutateAsync(articles);
    };

    return handleSignalListChange;
};