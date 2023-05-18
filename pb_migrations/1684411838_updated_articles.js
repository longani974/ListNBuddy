migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  collection.viewRule = "id ?= @collection.lists.articles.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6urf2r34f372wpi")

  collection.viewRule = null

  return dao.saveCollection(collection)
})
