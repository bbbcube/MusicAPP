import falcon
from api.lib.mongoutils import mongoid
from bson.json_util import dumps, loads
from datetime import datetime


class Music:
    VALID_ATTRIBUTES = {
        'title',
        'genre',
        'rating',
    }

    REQUIRED_ATTRIBUTES = {
        'title',
        'genre',
        'rating',
    }

    def on_get(self, req, resp, id=None):
        # return a specific
        if id:
            _id = mongoid(id)
            record = self.db.records.find({"id": _id})
            if record:
                resp.body = dumps(record)
                return
            # no record found
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "No record found"})
            return

        # return all records
        records = []
        for music in self.db.records.find({}):
            records.append(music)

        resp.body = dumps(records)
        return

    def on_post(self, req, resp, id=None):
        # grab data for new contact
        data = req.context['data'] if 'data' in req.context else None

        # sanity
        if not data:
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "Missing music data"})
            return

        # sanity check, do we have any invalid data
        for param in data:
            if param not in self.VALID_ATTRIBUTES:
                resp.status = falcon.HTTP_400
                resp.body = dumps({"error": f"Invalid attribute {param}"})
                return

        # do we have all essential data
        for param in self.REQUIRED_ATTRIBUTES:
            if param not in data:
                resp.status = falcon.HTTP_400
                resp.body = dumps({"error": f"Missing required attribute {param}"})
                return

        if id:
            id = mongoid(id)
            data['updated'] = datetime.utcnow()
            music = self.db.records.update_one(
                {"_id": id},
                {"$set": data}
            )
            if music.matched_count != 1:
                resp.status = falcon.HTTP_404
                return
            resp.body = dumps({"error": "ok"})
            return

        data['created'] = datetime.utcnow()

        _id = self.db.records.insert_one(data).inserted_id

        resp.body = dumps({"error": "ok", "_id": _id})
        return

    def on_delete(self, req, resp, id=None):
        # sanity
        if (not id):
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "Missing record data"})

        _id = mongoid(id)

        self.db.records.delete_one(
            {"_id": _id}
        )

        return
