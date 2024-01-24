import boto3
from django.conf import settings
import mimetypes


s3 = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
)


def upload_file(filename, file):
    # Guess the content type of the file
    content_type, _ = mimetypes.guess_type(filename)
    if content_type is None:
        content_type = 'application/octet-stream'  # Use a default MIME type

    response = s3.put_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=f'{settings.ENVIRONMENT}/{filename}',
        Body=file,
        ContentType=content_type
    )
    if response["ResponseMetadata"]["HTTPStatusCode"] != 200:
        return False
    return True


def file_exists(filename):
    try:
        s3.get_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=f'{settings.ENVIRONMENT}/{filename}',
        )
        return True
    except s3.exceptions.NoSuchKey:
        return False
