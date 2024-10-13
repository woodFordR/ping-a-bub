# pull image
FROM python:3.12.7-slim-bullseye

# set dir
WORKDIR /usr/src/ping_a_bub

# set envs
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install deps.
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .

