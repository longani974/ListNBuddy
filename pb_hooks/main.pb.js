// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../pb_data/types.d.ts" />

// Handle hooks on Lists collection
onRecordAfterCreateRequest((e) => {
    console.log("from the backend and after create invitations");
    const collection = $app.dao().findCollectionByNameOrId("invitations");

    const authRecord = e.httpContext.get("authRecord");

    if (authRecord) {
        const record = new Record(collection, {
            // bulk load the record data during initialization
            list: e.record?.id,
            by: authRecord.id,
            user: authRecord.id,
            status: "accept",
        });
        $app.dao().saveRecord(record);
    }
}, "lists");
