from rest_framework import serializers

#------------------ Pagination serializer---------------------------------
class PaginationSerializer(serializers.Serializer):
    page_number = serializers.IntegerField(required=True)
    page_size = serializers.IntegerField(required=True) 

class PageNumberSerializer(serializers.Serializer):
    page_number = serializers.IntegerField(required=True)

    def validate(self,data):
        if int(data['page_number']) <= 0 :
            raise serializers.ValidationError("Invalid Page Number")
        return data


class PageSizeSerializer(serializers.Serializer):
    page_size = serializers.IntegerField(required=True) 

    def validate(self,data):
        if int(data['page_size']) <= 0 :
            raise serializers.ValidationError("Invalid Page Size")
        return data