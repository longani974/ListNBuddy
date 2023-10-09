import pb from "../lib/pocketbase";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtoms";
import { Article, Lists } from "../types/dbPocketbasetypes";
import { useInvitateUser } from "./useInvitateUser";
import { useLocalStorage } from "usehooks-ts";
import { useMutation } from "@tanstack/react-query";
import { useNewArticleAdder } from "./useNewArticleAdder";
import useInvitations from "./useInvitations";


export default function useSaveTheLocalStorageListsInDB() {
    const [user] = useRecoilState(userState);

    const acceptedInvitations = useInvitations("accept");

    const inviteUser = useInvitateUser();
    const newArticleAdder = useNewArticleAdder(() =>
        console.log("article added")
    );

    const [localStorageLists, setLocalStorageLists] = useLocalStorage<Lists[]>(
        "listnbuddy_lists",
        []
    );

    const createList = async ({
        listName,
        userId,
    }: {
        listName: string;
        userId: string | undefined;
    }) => {
        // example create data
        const data = {
            name: listName,
            createBy: userId,
        };

        const recordList = await pb.collection("lists").create(data);
        return recordList as Lists;
    };

    const newListMutation = useMutation(createList, {
        onSuccess: async (list) => {
            const { totalItems } = await pb
                .collection("invitations")
                .getList(1, 1, {
                    sort: "created",
                    filter: `user.id = "${pb.authStore.model?.id}" && status = "accept"`,
                    fields: "id",
                    $autoCancel: false,
                });
            const status = totalItems < 5 ? "accept" : "waiting";

            await inviteUser.mutateAsync({
                id: list.id,
                email: pb.authStore?.model?.email,
                status: status,
            });

            await addAllArticles(list.id);
            setLocalStorageLists([]);
        },
        onError: () => {
            console.log("error mutation createList");
        },
    });

    const handleAddNewList = async () => {
        // TODO: use react-query
        // const list = await createList();
        console.log(acceptedInvitations.length);

        const listName = localStorageLists[0].name;
        const userId = pb.authStore?.model?.id;
        console.log(userId);
        if (!userId) throw new Error("userId is undefined");

        const list = await newListMutation.mutateAsync({ listName, userId });

        return list;
    };

    const handleAddNewArticle = async (data: { article: Article; listId: string; }) => {
        console.log(data);
        const { mutateAsync, isSuccess, isError, error, isLoading } =
            newArticleAdder;
        // make a copy of the data.article object except for the key data.article.id
        // because pocketbase will create the id
        // eslint-disable-next-line
        const { id, ...article } = data.article;
        console.log(article);

        await mutateAsync({
            ...article,
            list: data.listId,
            addBy: user.userId,
        });

        console.log(isError, isSuccess, isLoading);
        isLoading && console.log("loading mutation createArticle");
        if (isSuccess) {
            console.log("success mutation createArticle");
        }
        if (isError) {
            console.log("error mutation createArticle");
            console.log(error);
        }
    };

    const addAllArticles = async (listId: string) => {
        const list = localStorageLists[0];
        const articles = list.expand.articles;
        console.log(articles);
        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            await handleAddNewArticle({ article, listId });
        }
    };

    const saveLocalStorageListInDb = async () => {
        if (localStorageLists.length > 0) {
            await handleAddNewList();
        }
    };

    return { saveLocalStorageListInDb };
}
