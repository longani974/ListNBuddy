migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd")

  collection.updateRule = "@request.auth.id = \"\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
