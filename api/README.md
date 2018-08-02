# Python Microservices

## Run in development environment
* start mongodb `sudo service mongod start`
* `pip install virtualenv`
* `virtualenv .musicapp`
* `source .musicapp/bin/activate`
* `pip install -R requirements.txt`
* `gunicorn api.app:app` this will serve the APIs on http://localhost:8000

* Run http://localhost:8000/ping on your browser to test the APIs are working, it shows you `pong`

## Run application in stagging or production server


## APIs endpoints
- [`GET` /ping](#-get-/ping)

     **Genres**
- [`GET` /gneres](#-get-/gneres)
- [`POST` /gneres](#-post-/gneres)
- [`POST` /gneres/{id}](#-post-/gneres/{id})

     **Records**
- [`GET` /records](#-get-/records)
- [`POST` /records](#-get-/records)
- [`POST` /records/{id}](#-get-/records/{id})


### `GET` /ping

**Returns**

`pong`
#
### `GET` /gneres

**Required permissions**

None

**Parameters**

None

**Returns**

An array of JSON objects, one for each genre item.

**Possible Errors**

None

**Remarks**

Returns an array of objects like those in the below example:
```
[
    {
        "_id": {
            "$oid": "5b62526648ae1d1c89602d8c"
        }, 
        "genre_title": "Pop"
    }, 
    {
        "_id": {
            "$oid": "5b62527648ae1d1c89602d8d"
        }, 
        "genre_title": "Rock"
    },
    ...
]
```
#
### `POST` /gneres
Insert a new genre.

**Required permissions**

None

**Parameters**

None

**Body**

`data` a JSON object containing the genre information.

* genre_title


**Returns**

```
{
    "error": "ok", 
    "_id": {
        "$oid": "5b627a6948ae1d4177bbfcfe"
    }
}
```

**Possible Errors**

`400 Bad Request` post data are required

`404 Not Found` body parameters may not found or some un authenticated data has passed.
#
### `POST` /gneres/{id}
Update a specific genre.

**Required permissions**

None

**Parameters**

`id` as genre mongodb object id

**Body**

`data` a JSON object containing the genre information.

* genre_title


**Returns**

```
{
    "error": "ok", 
}
```

**Possible Errors**

`400 Bad Request` post data are required

`404 Not Found` body parameters may not found or some un authenticated data has passed.
#
### `GET` /records

**Required permissions**

None

**Parameters**

None

**Returns**

An array of JSON objects, one for each music record item.

**Possible Errors**

None

**Remarks**

Returns an array of objects like those in the below example:
```
[
    {
        "_id": {
            "$oid": "5b625dd248ae1d1c89602d92"
        }, 
        "title": "Fire", 
        "genre": {
            "_id": {
                "$oid": "5b62526648ae1d1c89602d8c"
            }, 
            "genre_title": "Pop"
        }, 
        "rating": 4, 
        "created": {"$date": 1533173202862}, "updated": {"$date": 1533179054525}
    },
    ...
]
```
#
### `POST` /records
Insert a new record.

**Required permissions**

None

**Parameters**

None

**Body**

`data` a JSON object containing the music record information.

* title
* genre
* rating


**Returns**

```
{
    "error": "ok", 
    "_id": {
        "$oid": "5b627a6948ae1d4177bbfcfe"
    }
}
```

**Possible Errors**

`400 Bad Request` post data are required

`404 Not Found` body parameters may not found or some un authenticated data has passed.
#
### `POST` /records/{id}
Update a specific record item.

**Required permissions**

None

**Parameters**

`id` as record mongodb object id

**Body**

`data` a JSON object containing the music record information.

* title
* genre
* rating


**Returns**

```
{
    "error": "ok", 
}
```

**Possible Errors**

`400 Bad Request` post data are required

`404 Not Found` body parameters may not found or some un authenticated data has passed.
#