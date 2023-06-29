migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q4xib4qj",
    "name": "accept",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "yes",
        "no",
        "waiting"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  // remove
  collection.schema.removeField("q4xib4qj")

  return dao.saveCollection(collection)
})
