migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q4xib4qj",
    "name": "status",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "accept",
        "reject",
        "block",
        "waiting"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  // update
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
})
