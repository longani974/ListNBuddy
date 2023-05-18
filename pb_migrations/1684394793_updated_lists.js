migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0no2ysw7",
    "name": "users",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
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
  collection.schema.removeField("0no2ysw7")

  return dao.saveCollection(collection)
})
