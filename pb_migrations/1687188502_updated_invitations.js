migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.listRule = "(@request.auth.id ?= @collection.invitations.user.id) && (@request.auth.id \n = @collection.invitations.user.id)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.listRule = null

  return dao.saveCollection(collection)
})
