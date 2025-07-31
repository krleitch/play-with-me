/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2546747700")

  // remove field
  collection.fields.removeById("select1874629670")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2546747700")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select1874629670",
    "maxSelect": 4,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "tutorial",
      "backing-track",
      "theory",
      "cover"
    ]
  }))

  return app.save(collection)
})
