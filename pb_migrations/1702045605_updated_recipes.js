/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0od4gu4ng16vcja")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qiwl8cwy",
    "name": "ingredients",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "a8cylyix9907wrl",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0od4gu4ng16vcja")

  // remove
  collection.schema.removeField("qiwl8cwy")

  return dao.saveCollection(collection)
})
