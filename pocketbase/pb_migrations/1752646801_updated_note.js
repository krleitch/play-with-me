/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3903888804")

  // remove field
  collection.fields.removeById("text3065852031")

  // add field
  collection.fields.addAt(2, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor3065852031",
    "maxSize": 0,
    "name": "message",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3903888804")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3065852031",
    "max": 0,
    "min": 0,
    "name": "message",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("editor3065852031")

  return app.save(collection)
})
