migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.deleteRule = "@request.auth.id = @collection.invitationsList.user.id || @request.auth.id = @collection.invitationsList.by.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
