from sentry_sdk import capture_exception


class SentryCaptureExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
        except Exception as e:
            capture_exception(e)
            raise e from None
        return response
