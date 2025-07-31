/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3078710471")

  // update field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2546747700",
    "hidden": false,
    "id": "relation3615625517",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "playlist",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3078710471")

  // update field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2546747700",
    "hidden": false,
    "id": "relation3615625517",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "playlist",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
