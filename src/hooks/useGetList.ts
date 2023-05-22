import { useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { Lists } from "../types/dbPocketbasetypes";
import { useEffectOnce } from "./useEffectOnce";

export default function useGetList() {
    const queryClient = useQueryClient();

    useEffectOnce(() => {
        // Subscribe to changes only in the specified record

        const realTime = async () =>
            await pb
                .collection("lists")
                .subscribe("fruv4feowetokkn", function () {
                    getList().then((e) => {
                        queryClient.setQueryData(["listsfruv4feowetokkn"], e);
                    });
                });

        realTime();

        return () => {
            console.log("destroy");
            pb.collection("lists").unsubscribe("fruv4feowetokkn");
        }; // remove all 'RECORD_ID' subscriptions
    });

    const getList = async () => {
        return await pb.collection("lists").getOne<Lists>("fruv4feowetokkn", {
            expand: "articles",
        });
    };
    const queryResult = useQuery(["listsfruv4feowetokkn"], getList);

    // Handle the undefined case by giving some "initial data"
    // https://github.com/TanStack/query/discussions/1331
    // nedgrady answer
    return { lists: queryResult.data ?? [], ...queryResult };
}


