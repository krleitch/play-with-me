/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number291310061",
    "max": null,
    "min": null,
    "name": "seekCC",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3439380945",
    "max": null,
    "min": null,
    "name": "sendCC",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number489826646",
    "max": null,
    "min": null,
    "name": "sendCCValue",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number2901379139",
    "max": null,
    "min": null,
    "name": "sendPC",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4143549482")

  // remove field
  collection.fields.removeById("number291310061")

  // remove field
  collection.fields.removeById("number3439380945")

  // remove field
  collection.fields.removeById("number489826646")

  // remove field
  collection.fields.removeById("number2901379139")

  // remove field
  collection.fields.removeById("number1258598149")

  return app.save(collection)
})
