#!/bin/bash

# Define the path to your app.yaml file
APP_YAML_FILE="app.yaml"

# Ensure all environment variables are available
if [[ -z "${{secrets.DATABASE_URL}}" || -z "${{secrets.SENDGRID_API_KEY}}" || -z "${{secrets.SENDGRID_VERIFIED_SENDER}}" || -z "${{secrets.ENCRYPTION_ROUNDS}}" || -z "${{secrets.JWT_SECRET}}" ]]; then
  echo "One or more environment variables are missing. Please check your GitHub secrets."
  exit 1
fi

# Replace placeholders in app.yaml with corresponding environment variables
sed -i "s|{{DATABASE_URL}}|${{secrets.DATABASE_URL}}|g" $APP_YAML_FILE
sed -i "s|{{SENDGRID_API_KEY}}|${{secrets.SENDGRID_API_KEY}}|g" $APP_YAML_FILE
sed -i "s|{{SENDGRID_VERIFIED_SENDER}}|${{secrets.SENDGRID_VERIFIED_SENDER}}|g" $APP_YAML_FILE
sed -i "s|{{ENCRYPTION_ROUNDS}}|${{secrets.ENCRYPTION_ROUNDS}}|g" $APP_YAML_FILE
sed -i "s|{{JWT_SECRET}}|${{secrets.JWT_SECRET}}|g" $APP_YAML_FILE

echo "Environment variables have been replaced in $APP_YAML_FILE."
