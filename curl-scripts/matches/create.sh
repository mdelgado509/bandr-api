#!/bin/sh

API="http://localhost:4741"
URL_PATH="/profiles/${ID}/match"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \

echo
