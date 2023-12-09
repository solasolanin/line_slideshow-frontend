#!/bin/bash

# シークレットの環境変数を取得
ACCESS_KEY_ID=$(aws secretsmanager get-secret-value --secret-id line-slideshow-sm-dev --output json | jq -r '.SecretString' | jq -r '.ACCESS_KEY_ID')
SECRET_ACCESS_KEY=$(aws secretsmanager get-secret-value --secret-id line-slideshow-sm-dev --output json | jq -r '.SecretString' | jq -r '.SECRET_ACCESS_KEY')

npm run build
npx serverless deploy --stage prod \
    --param="ENV_AWS_ACCESS_KEY_ID=${ACCESS_KEY_ID}" \
    --param="ENV_AWS_SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY}"
