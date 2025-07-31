/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3078710471")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select59357059",
    "maxSelect": 4,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "backing-track",
      "tutorial",
      "cover",
      "theory"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3078710471")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select59357059",
    "maxSelect": 4,
    "name": "tag",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "backing-track",
      "tutorial",
      "cover",
      "theory"
    ]
  }))

  return app.save(collection)
})
