/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // remove field
  collection.fields.removeById("text858781181")

  // remove field
  collection.fields.removeById("text3686306543")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text858781181",
    "max": 0,
    "min": 0,
    "name": "seekMidi",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3686306543",
    "max": 0,
    "min": 0,
    "name": "sendMidi",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
