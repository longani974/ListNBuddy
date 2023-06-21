migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.viewRule = "@request.auth.id = @collection.invitations.user.id"
  collection.updateRule = "@request.auth.id = @collection.invitations.user.id || @request.auth.id = @collection.invitations.by.id"
  collection.deleteRule = "@request.auth.id = @collection.invitations.user.id || @request.auth.id = @collection.invitations.by.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.viewRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
