# recordsbygenre.py

import falcon
from api.lib.mongoutils import mongoid
from bson.json_util import dumps, loads


class Recordsbygenre:

    def on_get(self, req, resp, genre=None):
        if not genre:
            # no genre found
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "No genre found"})
            return

        gen_details = self.db.genres.find_one({"genre_title": genre})

        if not gen_details:
            # no genre found
            resp.status = falcon.HTTP_404
            resp.body = dumps({"error": "No genre found"})
            return

        _gid = gen_details['_id']
        # return all records
        records = []
        for music in self.db.records.find({"genre._id": _gid}):
            records.append(music)

        resp.body = dumps(records)
        return
