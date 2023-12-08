/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eqoxq0mj",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  // remove
  collection.schema.removeField("eqoxq0mj")

  return dao.saveCollection(collection)
})
