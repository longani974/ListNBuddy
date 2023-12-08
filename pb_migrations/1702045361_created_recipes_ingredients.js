/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "a8cylyix9907wrl",
    "created": "2023-12-08 14:22:41.510Z",
    "updated": "2023-12-08 14:22:41.510Z",
    "name": "recipes_ingredients",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "2x5ycscs",
        "name": "name",
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
        "id": "tzypczkz",
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
        "id": "spxlz5zp",
        "name": "recipe",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "0od4gu4ng16vcja",
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
  const collection = dao.findCollectionByNameOrId("a8cylyix9907wrl");

  return dao.deleteCollection(collection);
})
