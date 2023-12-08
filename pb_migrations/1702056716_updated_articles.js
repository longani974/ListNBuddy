/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eqoxq0mj",
    "name": "list",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "xx7k83v0jio5tp8",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  // update
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
})
