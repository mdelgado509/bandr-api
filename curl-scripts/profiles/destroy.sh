#!/bin/bash

API="http://localhost:4741"
URL_PATH="/profile/destroy"

curl "${API}${URL_PATH}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
