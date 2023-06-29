//

import { useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
// import { Lists } from "../types/dbPocketbasetypes";
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
        listId.length && console.log("realTime")
        return () => {
            pb.collection("lists").unsubscribe(listId);
        }; // remove all 'RECORD_ID' subscriptions
    }, [queryClient, listId]);

    const getLastList = async () => {
        // const listItems = await pb.collection("lists").getList<Lists>(1, 1, {
        //     expand: "articles",
        //     filter: `participants.id = "${pb.authStore.model?.id}"`
        // });
        // const latestItem = listItems.items[0];
        // if (latestItem) {
        //     setListId(latestItem.id);
        //     return latestItem;
        //   } else {
        //     return null;
        //   }

        const lastInvitation = await pb.collection("invitations").getList(1, 1, {
            filter: `user.id = "${pb.authStore.model?.id}" && status = "accept"`,
            expand: "list.articles",
        });

        // const acceptedInvitations = lastInvitation.items.filter(
            
        //     (e) => {
        //         console.log(e)
        //         console.log(e.status === "accept")
        //         return e.status === "accept"}
        // );

        
        const latestItem = lastInvitation.items[0]?.expand?.list;
        if (latestItem) {
            console.log("latestItem", latestItem);
            setListId(latestItem.id);
            return latestItem;
        }   else {
            return null;
        }
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
