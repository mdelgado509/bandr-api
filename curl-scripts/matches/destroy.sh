#!/bin/bash

API="http://localhost:4741"
URL_PATH="/matches/${ID}"

curl "${API}${URL_PATH}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
