#!/bin/sh

echo "Patiently waiting for database ..."

while ! nc -z bubster-db 5432; do
  sleep 0.1
done

echo "PostgreSQL running, running migrations ..."

alembic upgrade head

exec "$@"

