/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text724990059",
        "max": 0,
        "min": 0,
        "name": "title",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text22648455",
        "max": 0,
        "min": 0,
        "name": "artist",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "date2198999173",
        "max": "",
        "min": "",
        "name": "lastPlayed",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_2546747700",
    "indexes": [],
    "listRule": null,
    "name": "playlist",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2546747700");

  return app.delete(collection);
})
