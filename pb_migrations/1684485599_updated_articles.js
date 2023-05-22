migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ikiknpue",
    "name": "field",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  // remove
  collection.schema.removeField("ikiknpue")

  return dao.saveCollection(collection)
})
