#!/bin/env bash

export TS_POST_PROCESS_FILE="npx prettier --write"

npx openapi-generator-cli generate -i https://api-dev.conix.ai/api/conix-ai/v3/api-docs -g typescript-axios -o app/api/generated --skip-validate-spec --enable-post-process-file --additional-properties="supportsES6=true,useSingleRequestParameter=true,withInterfaces=true,withNodeImports=true,withSeparateModelsAndApi=true,modelPackage=models,apiPackage=api,typescriptThreePlus=true"
