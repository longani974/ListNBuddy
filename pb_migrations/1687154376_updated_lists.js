migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = "@request.auth.id ?= @collection.lists.participants.id || @request.auth.id ?= @collection.lists.invited.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xx7k83v0jio5tp8")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
