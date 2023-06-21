migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd")

  collection.listRule = "@request.auth.id = \"\""
  collection.viewRule = "@request.auth.id = @collection.invitations.user.id"
  collection.createRule = "@request.auth.id = \"\""
  collection.updateRule = "@request.auth.id = @collection.invitations.user.id"
  collection.deleteRule = "@request.auth.id = @collection.invitations.user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
