migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0zn1vzqo",
    "name": "articles",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "6urf2r34f372wpi",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8")

  // remove
  collection.schema.removeField("0zn1vzqo")

  return dao.saveCollection(collection)
})
