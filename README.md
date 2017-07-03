# RestSqlite
A Node.js RESTful application which uses a SQLite DB to persist data

A "cars" API example is provided as an example which you can use as template for your requirements.

# How to use

```
clone this repository
cd into directory
>npm install
>npm run start
```
then use a REST client, CURL, etc in order to query the SQLite DB.

# Request examples

### GET: List ALL records
```
GET http://localhost:3000/cars/
```

### GET/id: Return one single record for the matching ID
```
GET http://localhost:3000/cars/1
```

### POST: Creates a NEW record
```
POST http://localhost:3000/cars/

BODY: 
{
   "name": "Lamborghini",
   "color": "Red"
}
```

### PUT/id: UPDATE an existing record for the matching ID

```
PUT http://localhost:3000/cars/1

BODY: 
{
   "name": "Ferrari",
   "color": "Red"
}
```

### DELETE/id: DELETES one record for the matching ID
```
DELETE http://localhost:3000/cars/1
```


Based on [RESTfulAPITutorial](https://github.com/generalgmt/RESTfulAPITutorial) and [node-sqlite](https://github.com/codeforgeek/node-sqlite)


