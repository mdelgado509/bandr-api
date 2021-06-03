#!/bin/sh

API="http://localhost:4741"
URL_PATH="/profile/matches"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Bear ${TOKEN}"

echo