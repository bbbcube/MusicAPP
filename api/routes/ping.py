from bson.json_util import dumps


class Pingtest:

    def on_get(self, req, resp):
        resp.body = dumps("Pong!")
        return
