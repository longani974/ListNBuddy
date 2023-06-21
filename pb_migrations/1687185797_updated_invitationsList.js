migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.name = "invitations"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8scy60ckw68coo4")

  collection.name = "invitationsList"

  return dao.saveCollection(collection)
})
