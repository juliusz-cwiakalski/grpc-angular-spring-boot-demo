#!/bin/bash

PROJECT_PREFIX=chat



ROOT=`dirname "$0"`
ROOT=`realpath "$ROOT/../.."`
SUBPROJECT=$ROOT/$PROJECT_PREFIX
WEBUI_ROOT=${SUBPROJECT}-webapp
MESSAGES_ROOT=${SUBPROJECT}-proto/src/main/proto
PROTOC_GEN_TS_PATH=`realpath "${WEBUI_ROOT}/node_modules/.bin/protoc-gen-ts"`

# Directory to write generated code to (.js and .d.ts files)
TS_OUT_DIR="${WEBUI_ROOT}/src/app/grpc"
JS_OUT_DIR="$TS_OUT_DIR"

PROTO_FILES=`find ${MESSAGES_ROOT} -name '*.proto'`

echo "ROOT=$ROOT
PROJECT_PREFIX=$PROJECT_PREFIX
SUBPROJECT=$SUBPROJECT
WEBUI_ROOT=$WEBUI_ROOT
MESSAGES_ROOT=$MESSAGES_ROOT
PROTOC_GEN_TS_PATH=$PROTOC_GEN_TS_PATH
TS_OUT_DIR=$TS_OUT_DIR
PROTO_FILES=$PROTO_FILES
"

mkdir -p $TS_OUT_DIR


protoc echo.proto \
  --js_out=import_style=commonjs:./output \
  --grpc-web_out=import_style=commonjs:./output


protoc \
    --proto_path=${MESSAGES_ROOT} \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${JS_OUT_DIR}" \
    --grpc-web_out=import_style=commonjs:${TS_OUT_DIR} \
    --ts_out="${TS_OUT_DIR}" \
    $PROTO_FILES
