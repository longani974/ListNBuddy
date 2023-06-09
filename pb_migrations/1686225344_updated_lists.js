migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8")

  // remove
  collection.schema.removeField("uprtx9wr")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uprtx9wr",
    "name": "articles",
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
