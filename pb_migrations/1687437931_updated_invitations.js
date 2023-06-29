migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xgojypqz",
    "name": "list",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "xx7k83v0jio5tp8",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "id",
        "created",
        "updated",
        "name",
        "createBy",
        "participants",
        "modifiedArticle",
        "articles",
        "invited"
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
    "id": "xgojypqz",
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
