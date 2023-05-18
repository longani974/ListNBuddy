import { useQuery } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { Lists } from "../types/dbPocketbasetypes";

export default function useGetList() {
    const getList = async () => {
        return await pb.collection("lists").getOne<Lists>("fruv4feowetokkn", {
            expand: "articles",
        });
    };
    const queryResult = useQuery(["lists"], getList);

    // Handle the undefined case by giving some "initial data"
    // https://github.com/TanStack/query/discussions/1331
    // nedgrady answer
    return { lists: queryResult.data ?? [], ...queryResult };
}
