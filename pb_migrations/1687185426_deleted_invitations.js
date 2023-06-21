migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "71zvoh3povv7qxd",
    "created": "2023-06-19 10:09:24.566Z",
    "updated": "2023-06-19 12:02:05.040Z",
    "name": "invitations",
    "type": "base",
    "system": false,
    "schema": [
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
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
