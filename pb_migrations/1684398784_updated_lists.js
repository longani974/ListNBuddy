migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0zn1vzqo",
    "name": "articles",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "6urf2r34f372wpi",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": [
        "id",
        "created",
        "updated",
        "name",
        "quantity",
        "isBuyed",
        "isBuyedBy",
        "addBy"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0zn1vzqo",
    "name": "articles",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "6urf2r34f372wpi",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
