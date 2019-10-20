Project setup step by step
==========================

Step 1 - create protobuf project
--------------------------------

Step 2 - create webapp
----------------------

### Add dependencies

    ng new chat-webapp

    npm install --save-dev @angular/cli @angular-devkit/build-angular @angular/compiler @angular/compiler-cli grpc_tools_node_protoc_ts @types/node

    npm install --save grpc tls stream os fs

    npm audit fix

### Fix compilation error: TS2304: Cannot find name 'Buffer'
Add node types to chat-webapp/src/tsconfig.app.json

    "compilerOptions": {
        "types": ["node"]
    },
