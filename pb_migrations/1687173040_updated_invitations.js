migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd")

  collection.viewRule = "@request.auth.id = \"\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("71zvoh3povv7qxd")

  collection.viewRule = null

  return dao.saveCollection(collection)
})
