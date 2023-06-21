migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd")

  collection.viewRule = "@request.auth.id = @collection.invitations.id"
  collection.deleteRule = "@request.auth.id = @collection.invitations.id"

  // remove
  collection.schema.removeField("ltr1tlci")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd")

  collection.viewRule = null
  collection.deleteRule = null

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ltr1tlci",
    "name": "user",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
