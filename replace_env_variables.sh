#!/bin/bash

# Define the path to your app.yaml file
APP_YAML_FILE="app.yaml"

# Ensure all environment variables are available
if [[ -z "${DATABASE_URL}" || -z "${SENDGRID_API_KEY}" || -z "${SENDGRID_VERIFIED_SENDER}" || -z "${ENCRYPTION_ROUNDS}" || -z "${JWT_SECRET}" ]]; then
  echo "One or more environment variables are missing. Please check your GitHub secrets."
  exit 1
fi

# Replace placeholders in app.yaml with corresponding environment variables
sed -i "s|{{DATABASE_URL}}|${DATABASE_URL}|g" $APP_YAML_FILE
sed -i "s|{{SENDGRID_API_KEY}}|${SENDGRID_API_KEY}|g" $APP_YAML_FILE
sed -i "s|{{SENDGRID_VERIFIED_SENDER}}|${SENDGRID_VERIFIED_SENDER}|g" $APP_YAML_FILE
sed -i "s|{{ENCRYPTION_ROUNDS}}|${ENCRYPTION_ROUNDS}|g" $APP_YAML_FILE
sed -i "s|{{JWT_SECRET}}|${JWT_SECRET}|g" $APP_YAML_FILE

echo "Environment variables have been replaced in $APP_YAML_FILE."
