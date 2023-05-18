migrate((db) => {
  const collection = new Collection({
    "id": "xx7k83v0jio5tp8",
    "created": "2023-05-17 12:02:55.442Z",
    "updated": "2023-05-17 12:02:55.442Z",
    "name": "lists",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nqubop0a",
        "name": "article",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rnvcrqhp",
        "name": "quantity",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "zaszxkea",
        "name": "isBuyed",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8");

  return dao.deleteCollection(collection);
})
