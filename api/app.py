import falcon
from falcon_cors import CORS
from api.middlewares.db import Db
from api.middlewares.jsonhandler import Jsonhandler
from api.routes.ping import Pingtest
from api.routes.music import Music
from api.routes.genres import Genres
from api.routes.recordsbygenre import Recordsbygenre


def create_app():
    cors = CORS(
        allow_all_origins=True,
        allow_all_headers=True,
        allow_all_methods=True,
        allow_credentials_all_origins=True
    )
    # Middleware
    jsonhandler = Jsonhandler()
    db = Db("music_app")

    # API components
    ping = Pingtest()
    genres = Genres()
    music = Music()
    recordsbygenre = Recordsbygenre()

    # Create wsgi app instance
    api = falcon.API(middleware=[
        cors.middleware,
        jsonhandler,
        db
    ])

    api.add_route('/ping', ping)
    api.add_route('/genres/{id}', genres)
    api.add_route('/genres/', genres)
    api.add_route('/records/{id}', music)
    api.add_route('/records/', music)
    api.add_route('/recordsbygenre/{genre}', recordsbygenre)

    return api


app = create_app()
