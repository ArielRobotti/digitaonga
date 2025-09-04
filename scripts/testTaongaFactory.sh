
dfx stop
dfx start --clean --background
dfx deploy taonga_factory

echo "Test deploy Taonga flow Prueba: GLB de 500 MB"

dfx wallet send $(dfx canister id taonga_factory) 50TC
principalId=$(dfx identity get-principal)
dfx canister call taonga_factory testDeployTaonga "(record {
    controller = principal \"$principalId\";
    culturalDescription = \"Tets Cultural Description\";
    admin = principal \"$principalId\";
    name = \"Test Taonga\";
    description = \"test Description\";
    dataSize =  524_288_000 : nat;
    tempFileId = 0 : int;
    chunksQty = 500 : nat;
  },
)"