migrate((db) => {
  const collection = new Collection({
    "id": "8scy60ckw68coo4",
    "created": "2023-06-19 14:32:48.953Z",
    "updated": "2023-06-19 14:32:48.953Z",
    "name": "invitationsList",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "oznkbpfx",
        "name": "user",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "xgojypqz",
        "name": "list",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "xx7k83v0jio5tp8",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "31ri3y3y",
        "name": "by",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4");

  return dao.deleteCollection(collection);
})
