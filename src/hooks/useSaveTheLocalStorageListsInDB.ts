// A hook to save the lists in the local storage in the database


import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtoms";
import { ClientResponseError } from "pocketbase";
import { Lists } from "../types/dbPocketbasetypes";

export default function useSaveTheLocalStorageListsInDB() {
    const [lists, setLists] = useState<Lists[]>([]);
    const [user] = useRecoilState(userState);

    const { mutate: saveLists } = useMutation(
        async (lists: Lists[]) => {
            const listsData = await pb.collection("lists").create(lists);
            return listsData;
        },
        {
            onSuccess: () => {
                localStorage.removeItem("lists");
            },
            onError: (err: ClientResponseError) => {
                console.log(err);
            },
        }
    );

    useEffect(() => {
        if (user.isLogin) {
            const lists = JSON.parse(localStorage.getItem("lists") || "[]");
            setLists(lists);
        }
    }, [user.isLogin]);

    useEffect(() => {
        if (lists.length > 0) {
            saveLists(lists);
        }
    }, [lists, saveLists]);
}