#!/bin/bash

API="http://localhost:4741"
URL_PATH="/profile/update"

curl "${API}${URL_PATH}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
      "profile": {
        "title": "'"${TITLE}"'",
        "text": "'"${TEXT}"'"
      }
    }'

echo
