from bson.objectid import ObjectId


# Given a Mongo object ID return a Mongo ObjectID
# Can be passed either a string or a Mongo object ID.
# Returns None if invalid


def mongoid(mid):
    result = None
    if isinstance(mid, str):
        try:
            result = ObjectId(mid)
        except Exception as Ex:
            pass  # Not much we can do
    elif isinstance(mid, ObjectId):
        result = mid
    return result
