migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  collection.viewRule = "(id ?= @collection.lists.articles.id) && (@request.auth.id ?= @collection.lists.participants.id)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  collection.viewRule = null

  return dao.saveCollection(collection)
})
