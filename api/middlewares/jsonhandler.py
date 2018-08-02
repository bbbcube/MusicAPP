from bson.json_util import loads


class Jsonhandler:
    # params which we only look for in JSON data packets
    # if we want to pass information using key other than 'data',
    # have to be add in this set
    VALID_PARAMS = {
        'data',
    }

    def process_request(self, req, resp):
        req.context['json'] = {}
        """Don't process JSON in the body of the request for GET
           requests as they use URL parameters"""
        if req.method == 'GET':
            return
        try:
            body = req.stream.read()
            # this should be pymongo's bson loads function
            req.context['json'] = loads(body.decode('utf-8'))
        except Exception as Ex:
            pass

        for key in self.VALID_PARAMS:
            if key in req.context['json'].keys():
                req.context[key] = req.context['json'][key]
            else:
                req.context[key] = None
