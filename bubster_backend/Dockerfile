# pull image
FROM python:3.13.0-slim-bookworm

# set dir for app 
RUN mkdir -p /home/app
RUN addgroup --system bubster && adduser --system --group bubster

ENV HOME=/home/app
ENV APP_HOME=/home/app/bubster_backend
RUN mkdir ${APP_HOME}
WORKDIR ${APP_HOME}

# set envs
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# system deps.
RUN apt-get update \
  && apt-get -y install netcat-traditional gcc postgresql \
  && apt-get clean

# upgrade pip, install poetry
RUN pip install --upgrade pip
RUN pip install poetry

# install deps.
COPY ./pyproject.toml .
RUN poetry export --without=dev --without-hashes --output=requirements.txt
RUN pip install -r requirements.txt

# copy app files
COPY . .

# add entry
COPY ./entrypoint.sh .
# RUN chmod +x /home/app/bubster-backend/entrypoint.sh
COPY ./.test.env .env
RUN chown -R bubster:bubster ${APP_HOME}

# change user
USER bubster

# initiate entry
ENTRYPOINT ["/home/app/bubster_backend/entrypoint.sh"]

