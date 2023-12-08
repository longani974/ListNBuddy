// import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "./atoms/userAtoms";
import { authFormState } from "./atoms/showAuthFormAtoms";
import Table from "./components/Table/Table";
import Drawer from "./components/Drawer";
import ModalMyInvitations from "./components/Table/ModalMyInvitations";
import useInvitations from "./hooks/useInvitations";
import ModalMyLists from "./components/Table/ModalMyLists";
import { listToShow } from "./atoms/listToShow";
import ModalForgetPassword from "./components/ModalForgetPasword";
import { Lists } from "./types/dbPocketbasetypes";
import ModalMyNewList, {
    MaxNumberList,
} from "./components/Table/ModalMyNewList";
import { onlineStatusState } from "./atoms/onlineStatusAtoms";
import { useCallback, useEffect, useState } from "react";
import ErrorToast from "./components/ErrorToast";
import { useLocalStorage } from "usehooks-ts";
import { useClickModal } from "./hooks/useClickModal";
import pb from "./lib/pocketbase";
import { useMutation } from "@tanstack/react-query";
// import { useInvitateUser } from "./hooks/useInvitateUser";
// import { useNewArticleAdder } from "./hooks/useNewArticleAdder";
const urlParams = new URLSearchParams(window.location.search);

export default function App() {
    // const [localStorageLists, setLocalStorageLists] = useState<Lists []>([])
    // const localStorageLists = useReadLocalStorage<Lists[]>("lists");
    const [localStorageLists, setLocalStorageLists] = useLocalStorage<Lists[]>(
        "listnbuddy_lists",
        []
    );

    const acceptInvitations = useInvitations("accept");

    const { isLogin, userId } = useRecoilValue(userState);
    const { indexListToShow } = useRecoilValue(listToShow);
    const setIndexListToShow = useSetRecoilState(listToShow);

    const { showAuthForm } = useRecoilValue(authFormState);
    const { clickModal } = useClickModal();

    const [onlineStatus, setOnlineStatus] = useRecoilState(onlineStatusState);
    const [recipesToken, setRecipesToken] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<{name:string, quantity:string}[]>();
    const [idList, setIdList] = useState<string>("");
    const [maxList, setMaxList] = useState<MaxNumberList["maxList"]>(1);
    const [nbOfList, setNbOfList] = useState<number>(0);

    // const newArticleAdder = useNewArticleAdder(() =>
    //     console.log("article added")
    // );

    // useEffect to get URLSearchParams
    //TODO: A custom hook to get URLSearchParams like in ModalForgetPassword.tsx
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("newPassword");
        if (token) {
            clickModal("modalForgetPassword");
        }
    }, [clickModal]);

    useEffect(() => {
        const token = urlParams.get("recipes");
        if (token) {
            setRecipesToken(token);
        }
    }, []);

    useEffect(() => {
        if (isLogin) {
            setMaxList(5);
            setNbOfList(acceptInvitations.length);
        } else {
            setMaxList(1);
            setNbOfList(localStorageLists.length);
        }
    }, [isLogin, acceptInvitations.length, localStorageLists.length]);

    useEffect(() => {
        console.log(
            "fdqsssssssssssssssssssssssssfjljkljlkjrelmhflzenpvt rchzoinurzeuivnpdsotvhi"
        );
        console.log(idList);
        const index = acceptInvitations.findIndex(
            (invitation) => invitation.list === idList
        );
        console.log(index)
        console.log(acceptInvitations);
        if (index > -1) {
            setIndexListToShow({
                indexListToShow: index,
            });
        }
    }, [acceptInvitations, idList, setIndexListToShow]);

    const createListLocalStorage = useCallback(
        (listName: string) => {
            // Create a list in the local storage
            const list = {
                id: Date.now().toString(),
                name: listName,
                createBy: "local",
                expand: { articles: [] },
            } as unknown as Lists;
            // const lists = JSON.parse(localStorage.getItem("lists") || "[]");
            const lists = localStorageLists || "[]";
            // TODO: fix the type of lists is unknown
            lists.push(list);

            setLocalStorageLists(lists);
        },
        [localStorageLists, setLocalStorageLists]
    );

    const createList = async ({
        listName,
        userId,
        recipeId,
    }: {
        listName: string;
        userId: string | undefined;
        recipeId: string | undefined;
    }) => {
        // example create data
        const data = {
            name: listName,
            createBy: userId,
            fromRecipe: recipeId,
        };

        const recordList = await pb.collection("lists").create(data);
        return recordList as Lists;
    };

    const mutation = useMutation(createList, {
        onSuccess: () => {
            console.log("success mutation createList");
        },
        onError: (err) => {
            console.log(err);
            return;
        },
    });

    const handleAddNewList = async (data: {
        listName: string;
        recipeId: string;
    }) => {
        // TODO: use react-query
        // const list = await createList();
        const { listName, recipeId } = data;
        if (!listName || !recipeId) return;

        // TODO: Make a reusable function or useHook
        // Check if we already download the recipe
        let foundIndex = -1;

        for (let i = 0; i < acceptInvitations.length; i++) {
            if (
                acceptInvitations[i].expand &&
                acceptInvitations[i].expand.list &&
                acceptInvitations[i].expand.list.fromRecipe === recipeId
            ) {
                foundIndex = i;
                break;
            }
        }
        if (foundIndex > -1) {
            alert("Vous avez déjà télécharger la recette!");
            setIdList(acceptInvitations[foundIndex].expand.list.id);
            return;
        }
        console.log("not return");
        // Create a list in the local storage if the user is offline
        if (!isLogin || (!isLogin && !onlineStatus)) {
            // FIXME: the setTimeout is used to wait for the modal to close because ii take time to close and
            // the state in local storage update before the modal is closed so we can see an warning message for a short time
            setTimeout(() => {
                createListLocalStorage(listName);
            }, 200);
            window.history.pushState({}, "", window.location.pathname);
            return;
        }

        console.log("START: LIST");
        const list = await mutation
            .mutateAsync({ listName, userId, recipeId })
            .then((res) => {
                urlParams.delete("recipes");
                window.history.pushState({}, "", window.location.pathname);
                setRecipesToken(null);
                return res;
            });
        return list;
    };

    // useEffect(() => {
    //     if (recipesToken) {
    //         await getRecipeFromId(recipesToken).then((data) => {
    //             //check if recipes already in invitations
    //             console.log("maybeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    //             if (data.expand.ingredients === undefined) return
    //             console.log("yesaiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    //             const deepCopy = JSON.parse(
    //                 JSON.stringify(data.expand.ingredients)
    //             );
    //             console.log(deepCopy);
    //             // const ingredients = data.expand.ingredients
    //             // console.log(ingredients)
    //             if (nbOfList < maxList) {
    //                 handleAddNewList({
    //                     listName: data.name,
    //                     recipeId: data.id,
    //                 }).then(async (data) => {
    //                     console.log("list adddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
    //                     if (!data) return;

    //                     urlParams.delete("recipes");
    //                     window.history.pushState(
    //                         {},
    //                         "",
    //                         window.location.pathname
    //                     );
    //                     setRecipesToken(null);
    //                     setIngredients(deepCopy);
    //                     data?.id && setIdList(data?.id);
    //                 });
    //             } else {
    //                 clickModal("myNewListModal");
    //             }
    //         });
    //     }
    //     // TODO: FIX this:
    //     // We don't pass handleAddNewList as depedency to avoid multiple creation of list
    // }, [clickModal, maxList, nbOfList, recipesToken]);

    
    useEffect(() => {
        // const getRecipeFromId = async (recipeId) => {
        //     const record = await pb.collection("recipes").getOne(recipeId, {
        //         expand: "ingredients",
        //     });
        //     return record;
        // };
        const fetchData = async () => {
            if (recipesToken) {
                try {
                    const data = await getRecipeFromId(recipesToken);
                    console.log(data)
                    if (data.expand.ingredients === undefined) return;
                    console.log("greattttttttttttttttttttttttttttttttttttttttttttttttttttttttt")
                    const deepCopy = JSON.parse(JSON.stringify(data.expand.ingredients));
                    if (nbOfList < maxList) {
                        handleAddNewList({
                            listName: data.name,
                            recipeId: data.id,
                        }).then(async (data) => {
                            if (!data) return;
                            urlParams.delete("recipes");
                            window.history.pushState({}, "", window.location.pathname);
                            setRecipesToken(null);
                            setIngredients(deepCopy);
                            console.log(data?.id)
                            data?.id && setIdList(data?.id);
                        });
                    } else {
                        clickModal("myNewListModal");
                    }
                } catch (error) {
                    console.error("Error fetching recipe data:", error);
                }
            }
        };
        fetchData();
        // TODO: FIX this:
            // We don't pass handleAddNewList as depedency to avoid multiple creation of lis
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickModal, maxList, nbOfList, recipesToken]);

    useEffect(() => {
        console.log("addinnnngggggg dattaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(ingredients);
        if (ingredients === undefined) return;
        if (!ingredients.length) return;
        console.log("gogogogogogogogogogo");
    
        const addIngredients = async () => {
            for (let i = 0; i < ingredients.length; i++) {
                console.log(i);
                console.log(ingredients[i].name);
    
                const data = {
                    name: ingredients[i].name,
                    quantity: ingredients[i].quantity,
                    isBuyed: false,
                    addBy: userId,
                    list: idList,
                };
    
                try {
                    console.log(data)
                    const res = await pb.collection("articles").create(data);
                    console.log(res);
                } catch (err) {
                    console.warn(err);
                } finally {
                    console.log("e");
                }
    
                console.log("yyyyyyyyyooooooooooooooooooooooollllllllllllllllllllllllllloooooooooooo");
            }
        };
    
        addIngredients();
    }, [idList, ingredients, userId]);
    

    const getRecipeFromId = async (recipeId: string) => {
        const record = await pb.collection("recipes").getOne(recipeId, {
            expand: "ingredients",
        });
        return record;
    };

    // if localStorageLists is null, set it to an empty array in a useEffect
    useEffect(() => {
        if (localStorageLists === null) {
            setLocalStorageLists([]);
        }
    }, [localStorageLists, setLocalStorageLists]);

    // This code is used to detect if the user is online or offline.
    // The code uses the online and offline events to detect the user's online status.
    // The code also updates the online status in the background.
    useEffect(() => {
        // Create a function that sets the online status
        // and updates the ui
        const updateOnlineStatus = (event: Event) => {
            const isOnline = event.type === "online";
            setOnlineStatus(isOnline);
        };

        // Listen for the online and offline events
        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        // Unsubscribe from the events when the component is removed
        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, [setOnlineStatus]);

    return (
        <>
            <Navbar />

            {showAuthForm && <Auth />}
            {showAuthForm && <ModalForgetPassword />}

            {!showAuthForm && (
                <>
                    <Drawer>
                        {/* {isLogin && ( */}
                        <div>
                            <div className="overflow-x-auto w-full">
                                {!isLogin && localStorageLists !== null && (
                                    // FIXME:
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    //@ts-ignore
                                    <Table
                                        {...(localStorageLists[
                                            indexListToShow
                                        ] as Lists)}
                                    />
                                )}

                                {acceptInvitations.length > 0 && (
                                    // TODO: fix this
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    //@ts-ignore
                                    <Table
                                        {...(acceptInvitations[indexListToShow]
                                            .expand.list as Lists)}
                                    />
                                )}

                                {!acceptInvitations.length &&
                                    !localStorageLists?.length && (
                                        <label
                                            htmlFor="myNewListModal"
                                            // onClick={() => {
                                            //     clickModal("myNewListModal");
                                            // }}
                                            className="btn"
                                        >
                                            Créer votre première liste
                                        </label>
                                    )}
                            </div>
                            <ModalMyInvitations />
                            <ModalMyLists />
                            <ModalMyNewList />
                        </div>
                        {/* )} */}
                    </Drawer>
                    <ModalForgetPassword />
                </>
            )}
            {!onlineStatus && (
                <ErrorToast message="Vous avez perdu votre connection internet.Les fonctionnalitées habituelles ne sont plus disponibles" />
            )}
        </>
    );
}
