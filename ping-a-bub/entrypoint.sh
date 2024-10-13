#!/bin/sh

echo "Patiently waiting for database ..."

while ! nc -z web-db 5432; do
  sleep 0.1
done

echo "PostgreSQL running ..."

exec "$@"

