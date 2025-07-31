/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // remove field
  collection.fields.removeById("number1258598149")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number1258598149",
    "max": null,
    "min": null,
    "name": "sendPCValue",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
