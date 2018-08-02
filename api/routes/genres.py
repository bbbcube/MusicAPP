import falcon
from bson.json_util import dumps
from datetime import datetime
from api.lib.mongoutils import mongoid


class Genres:
    VALID_ATTRIBUTES = [
        'genre_title',
    ]

    REQUIRED_ATTRIBUTES = [
        'genre_title',
    ]

    def on_get(self, req, resp, id=None):
        # Return a single genre details
        if id:
            id = mongoid(id)
            genre_details = self.db.genres.find_one({"_id": id}, {"created": 0})
            if genre_details:
                resp.body = dumps(genre_details)
                return
            # we didn't find the genre details
            resp.status = falcon.HTTP_404
            return

        # return all genres
        genre_list = []
        for genr in self.db.genres.find({}, {"created": 0}):
            genre_list.append(genr)

        resp.body = dumps(genre_list)
        return

    def on_post(self, req, resp, id=None):
        # grab data for new genre
        data = req.context['data'] if 'data' in req.context else None
        # sanity
        if not data:
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "Missing genre data"})
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
            genre = self.db.genres.update_one(
                {"_id": id},
                {"$set": data}
            )
            if genre.matched_count != 1:
                resp.status = falcon.HTTP_404
                return
            resp.body = dumps({"error": "ok"})
            return

        data['created'] = datetime.utcnow()
        _id = self.db.genres.insert_one(data).inserted_id
        resp.body = dumps({"error": "ok", "_id": _id})
        return

    def on_delete(self, req, resp, id=None):

        # sanity
        if (not id):
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "Missing genre data"})

        id = mongoid(id)

        self.db.genres.delete_one(
            {"_id": id}
        )

        return
