/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2546747700")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool1654835737",
    "name": "favourite",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2546747700")

  // remove field
  collection.fields.removeById("bool1654835737")

  return app.save(collection)
})
