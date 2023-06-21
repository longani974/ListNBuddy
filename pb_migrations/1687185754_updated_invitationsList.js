migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.viewRule = "@request.auth.id = @collection.invitationsList.user.id"
  collection.createRule = "@request.auth.id = \"\""
  collection.updateRule = "@request.auth.id = @collection.invitationsList.user.id || @request.auth.id = @collection.invitationsList.by.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
