#!/bin/sh

# Log that the script is running
echo "Running docker-entrypoint.sh."

# Replace placeholder with actual environment variable values
if [ -n "$BASE_PATH" ]; then
  echo "Replacing BASE_PATH in env.template.js with ${BASE_PATH}"
  sed -i "s|/__BASE_PATH__|${BASE_PATH}|g" /app/env.js
else
  echo "BASE_PATH is not set."
fi

# Log the contents of env.template.js after modification
echo "Contents of env.template.js after replacement:"
cat /app/env.js

# Start the application
echo "Starting the application..."