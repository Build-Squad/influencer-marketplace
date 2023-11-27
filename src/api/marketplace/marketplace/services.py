import math
from .serializers import PageSizeSerializer, PageNumberSerializer
from rest_framework.response import Response
from rest_framework import status

class Pagination:
    def __init__(self, qs, request):
        self.qs = qs
        self.page_number = request.GET.get('page_number', 1)
        self.page_size = request.GET.get('page_size', 10)
        self.total_data_count = qs.count()
        self.setValidPagination()
        i = self.page_size * (self.page_number - 1)
        j = self.page_size * self.page_number
        self.page_data = self.qs[i:j]

    def setValidPagination(self):
        print(self.page_size, self.page_number)
        page_size = PageSizeSerializer(data={'page_size': self.page_size})
        page_number = PageNumberSerializer(data={'page_number': self.page_number})
        if not page_size.is_valid():
            self.page_size = int(10)
        else:
            self.page_size = int(self.page_size)
        if not page_number.is_valid():
            self.page_number = 1
        else:
            self.page_number = int(self.page_number)

    def getDataCount(self):
        return self.total_data_count

    def getCurrentPageNumber(self):
        return self.page_number

    def getCurrentPageSize(self):
        return len(self.page_data)

    def getData(self):
        return self.page_data

    def getTotalpageCount(self):
        try:
            return math.ceil(self.getDataCount() / self.getCurrentPageSize())
        except:
            if self.getDataCount() == 0:
                return 0
            else:
                return 1

    def getPageInfo(self):
        return {
            'total_data_count': self.getDataCount(),
            'total_page_count': self.getTotalpageCount(),
            'current_page_number': self.getCurrentPageNumber(),
            'current_page_size': self.getCurrentPageSize()
        }

def handleServerException(e):
    print(e)
    return Response({
        'isSuccess': False,
        'data': None,
        'message': 'Internal Server Error',
        'errors': e,
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def handleBadRequest(e):
    print(e)
    return Response({
        'isSuccess': False,
        'data': None,
        'message': 'Bad Request',
        'errors': e,
    }, status=status.HTTP_400_BAD_REQUEST)

def handleNotFound(resource_name):
    return Response({
        'isSuccess': False,
        'data': None,
        'message': f'{resource_name} not found',
        'errors': f'{resource_name} not found',
    }, status=status.HTTP_404_NOT_FOUND)