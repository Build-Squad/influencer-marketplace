# pull the official base image
FROM python:3.11.6

# set work directory
WORKDIR /api

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
COPY ./requirements.txt /api/
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# copy project
COPY . /api

# Make ports available for dev
EXPOSE 8000

CMD ["python", "manage.py", "runsslserver", "0.0.0.0:8000"]
