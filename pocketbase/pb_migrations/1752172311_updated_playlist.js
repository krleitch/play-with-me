/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2546747700")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select2752791430",
    "maxSelect": 2,
    "name": "tunings",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "standard",
      "half-step-down",
      "drop",
      "alt",
      "open"
    ]
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select2203071480",
    "maxSelect": 2,
    "name": "genres",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "rock",
      "metal",
      "pop",
      "blues",
      "classical",
      "jazz"
    ]
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select1019177437",
    "maxSelect": 2,
    "name": "instruments",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "electric",
      "acoustic",
      "slide"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2546747700")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select2752791430",
    "maxSelect": 2,
    "name": "tuning",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "standard",
      "half-step-down",
      "drop",
      "alt",
      "open"
    ]
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select2203071480",
    "maxSelect": 2,
    "name": "genre",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "rock",
      "metal",
      "pop",
      "blues",
      "classical",
      "jazz"
    ]
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select1019177437",
    "maxSelect": 2,
    "name": "instrument",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "electric",
      "acoustic",
      "slide"
    ]
  }))

  return app.save(collection)
})
