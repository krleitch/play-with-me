/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool1358543748",
    "name": "enabled",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // remove field
  collection.fields.removeById("bool1358543748")

  return app.save(collection)
})
