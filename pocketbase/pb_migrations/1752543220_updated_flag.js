/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3078710471",
    "hidden": false,
    "id": "relation2093472300",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "video",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // remove field
  collection.fields.removeById("relation2093472300")

  return app.save(collection)
})
