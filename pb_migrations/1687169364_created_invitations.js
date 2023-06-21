migrate((db) => {
  const collection = new Collection({
    "id": "71zvoh3povv7qxd",
    "created": "2023-06-19 10:09:24.566Z",
    "updated": "2023-06-19 10:09:24.566Z",
    "name": "invitations",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ltr1tlci",
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
        "id": "wxx9dwwc",
        "name": "invitations",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "xx7k83v0jio5tp8",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
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
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd");

  return dao.deleteCollection(collection);
})
