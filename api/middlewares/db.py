from pymongo import MongoClient


class Db:

    def __init__(self, dbname=None):

        if dbname is not None:
            self.db = self.get_database(dbname)
        else:
            self.connect()

    def connected(self):
        return hasattr(self, '_connection') and self._connection

    def connect(self):

        # Already connected?
        if self.connected():
            return
        try:
            self._connection = MongoClient('localhost', 27017)
        except Exception as Ex:
            self._connection = None
            return Ex

    # return our database instance
    def get_database(self, dbname):
        self.connect()
        return self._connection[dbname]

    # make available of db instance to route resources
    def process_resource(self, req, resp, resource, params):
        if resource is not None:
            resource.db = self.db
