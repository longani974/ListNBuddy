// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../pb_data/types.d.ts" />

// Handle hooks on Lists collection
onRecordBeforeCreateRequest((e) => {
    // Étape 1: Obtenir l'ID de la recette depuis la requête
    const fromRecipeId = e.record?.get("fromRecipe");
    const authRecord = e.httpContext.get("authRecord");
    const userId = authRecord.id;

    // Assurez-vous que fromRecipeId et userId ne sont pas vides
    if (!fromRecipeId || !userId) {
        throw new Error("fromRecipeId ou userId est vide");
    }
    // Étape 2: Rechercher dans la collection 'lists'
    const arrayOfLists = $app.dao()?.findRecordsByFilter(
        "lists",
        `fromRecipe.id = "${fromRecipeId}"`,
        "", // Tri (vide si non spécifié)
        0 // Pas de limite spécifique
    );

    // Étape 3: Obtenir l'ID de l'utilisateur authentifié
    // const authRecord = e.httpContext.get("authRecord");
    // const userId = authRecord.id;

    // Étape 4: Rechercher dans la collection 'invitations'
    const arrayOfInvitations = $app.dao()?.findRecordsByFilter(
        "invitations",
        `user.id = "${userId}"`,
        "", // Tri (vide si non spécifié)
        0   // Pas de limite spécifique
    );

    // Étape 5: Vérifier les correspondances
    let isMatchFound = false;
    arrayOfLists?.forEach((listRecord) => {
        arrayOfInvitations?.forEach((invitationRecord) => {
            if (listRecord?.id === invitationRecord?.get("list")) {
                isMatchFound = true;
            }
        });
    });

    if (isMatchFound) {
        // Annuler la requête si une correspondance est trouvée
        // throw new Error("Une correspondance a été trouvée. Annulation de la requête.");
        throw new BadRequestError("Une correspondance a été trouvée. Annulation de la requête.");

        //return apis.NewBadRequestError("Votre message d'erreur personnalisé", errors.New("Message d'erreur détaillé"))
        // Ou vous pouvez retourner false si cela est plus approprié dans votre cas
        // return false;
    }
    // Si isMatchFound est false, rien n'est fait ici, donc la requête continue normalement
}, "lists");

onRecordAfterCreateRequest((e) => {
    const collection = $app.dao()?.findCollectionByNameOrId("invitations");

    const authRecord = e.httpContext.get("authRecord");

    if (authRecord) {
        const record = new Record(collection, {
            // bulk load the record data during initialization
            list: e.record?.id,
            by: authRecord.id,
            user: authRecord.id,
            status: "accept",
        });
        $app.dao()?.saveRecord(record);
    }
}, "lists");
