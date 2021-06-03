#!/bin/bash

API="http://localhost:4741"
URL_PATH="/profile/matches/${ID}/destroy"

curl "${API}${URL_PATH}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
