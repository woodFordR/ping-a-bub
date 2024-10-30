# pull image
FROM python:3.12.7-slim-bookworm

# set dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# set envs
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# system deps.
RUN apt-get update \
  && apt-get -y install netcat-traditional gcc postgresql \
  && apt-get clean

# install deps.
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# add entry
COPY ./entrypoint.sh .
RUN chmod +x /usr/src/app/entrypoint.sh

# initiate entry
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

