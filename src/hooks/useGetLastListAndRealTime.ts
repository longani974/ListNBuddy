//

import { useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { Lists } from "../types/dbPocketbasetypes";
import { useEffect, useState } from "react";

export default function useGetLastListAndRealTime() {
    const [listId, setListId] = useState<string>("");
    const queryClient = useQueryClient();

    useEffect(() => {
        // Subscribe to changes only in the specified record
        const realTime = async () => {
            await pb.collection("lists").subscribe(listId, function () {
                getLastList().then((e) => {
                    queryClient.setQueryData([listId], e);
                });
            });
        };

        listId.length && realTime();

        return () => {
            pb.collection("lists").unsubscribe(listId);
        }; // remove all 'RECORD_ID' subscriptions
    }, [queryClient, listId]);

    const getLastList = async () => {
        const listItems = await pb.collection("lists").getList<Lists>(1, 1, {
            expand: "articles",
        });
        const latestItem = listItems.items[0];
        if (latestItem) {
            setListId(latestItem.id);
            return latestItem;
          } else {
            return null;
          }
        // setListId(latestItem.id);
        // const latestItemId = latestItem.id;
        // const lastModifiedItem = await pb.collection('lists').get(latestItemId);
        // return latestItem;
    };

    const queryResult = useQuery([listId], getLastList);

    // if (queryResult.isLoading) {
    //     return { lists: [], ...queryResult };
    //   }

    // Handle the undefined case by giving some "initial data"
    // https://github.com/TanStack/query/discussions/1331
    // nedgrady answer
    return { lists: queryResult.data ?? [], ...queryResult };
}
