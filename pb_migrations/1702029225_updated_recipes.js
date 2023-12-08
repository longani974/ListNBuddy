/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0od4gu4ng16vcja")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6rvqkch3",
    "name": "author",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0od4gu4ng16vcja")

  // remove
  collection.schema.removeField("6rvqkch3")

  return dao.saveCollection(collection)
})
