/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3903888804")

  // add field
  collection.fields.addAt(2, new Field({
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3903888804")

  // remove field
  collection.fields.removeById("relation3615625517")

  return app.save(collection)
})
