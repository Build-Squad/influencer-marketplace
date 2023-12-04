# pull the official base image
FROM python:3.10.11

# set work directory
WORKDIR /api

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip 
COPY ./requirements.txt /api/
RUN pip install -r requirements.txt

# copy project
COPY . /api

# Make ports available for dev
EXPOSE 8000

CMD ["python", "manage.py", "runsslserver", "0.0.0.0:8000"]