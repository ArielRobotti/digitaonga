#!/bin/bash
dfx stop
dfx start --clean --background

dfx identity list | grep -q "^000Admin$" || dfx identity new 000Admin
export PrincipalAdmin=$(dfx identity get-principal --identity 000Admin)
dfx identity use 000Admin
dfx deploy motokoDao

dfx wallet send uxrrr-q7777-77774-qaaaq-cai 50TC

dfx identity list | grep -q "^000Guardian1$" || dfx identity new 000Guardian1
export PrincipalGuardian01=$(dfx identity get-principal --identity 000Guardian1)

dfx identity use 000Admin

firtsMember=$(dfx canister call motokoDao create_member)

if echo "$firtsMember" | grep -q 'role = variant { Admin }'; then
    echo "✅ Successful role test: The first member's role is Admin."
else
    echo "❌ Role test failed: The first member's role is not Admin."
fi

dfx identity use 000Guardian1
secondMember=$(dfx canister call motokoDao create_member)

if echo "$secondMember" | grep -q 'role = variant { Observer }'; then
    echo "✅ Successful role test: The second member's role is Observer."
else
    echo "❌ Role test failed: The second member's role is not Observer."
fi

dfx identity use 000Admin
dfx canister call motokoDao batch_update_member_role "(
  vec {
    principal \"$PrincipalGuardian01\";
  },
  variant { NFTCreator },
)"

dfx identity use 000Guardian1
updatedRoleSecondMember=$(dfx canister call motokoDao create_member)

if echo "$updatedRoleSecondMember" | grep -q 'role = variant { NFTCreator }'; then
    echo "✅ Successful update role test: The Admin successfully granted the NFTCreator role to the second member."
else
    echo "❌ Update Role test failed: The second member's role is not NFTCreator."
fi

dfx identity use 000Admin


echo "Test push proposal to create taonga from admin whitout votation instance"

export timestamp=$(dfx canister call motokoDao time)
timestamp_number=$(echo "$timestamp" | sed -E 's/^\((.*) : int\)$/\1/' | tr -d '_')
incremento=120000000000
export deadline=$(echo "$timestamp_number + $incremento" | bc)

CreateTaongaProposal=$(dfx canister call motokoDao create_proposal '(
  record {
    impact = "Tets Impacto field";
    title = "Test Title Field";
    kind = variant {
      DigitalTaonga = variant {
        CreateDigitalTaonga = record {
          thumbnail = blob "\00\11\22";
          name = "Test Name Taonga Field";
          description = "Test Description field";
          deadline = '$deadline';
          history = "Test History field";
          dataSize = 4 : nat;
          chunksQty = 1 : nat;
          imageID = 0 : nat;
        }
      }
    };
    description = "Test Proposal Description Field";
    deadline = '$deadline';
    extendedData = vec {};
  },
)')
echo "Response from create_proposal: $CreateTaongaProposal"

# Corrected variable assignment
FileId=$(echo "$CreateTaongaProposal" | grep -o 'id = [0-9_]\+' | head -n 1 | awk '{print $NF}' | tr -d '_')
echo "Extracted ID: $FileId"

echo " ⬆️  uploading file chunk..."


dfx canister call motokoDao uploadFileChunk "(
  record {
    chunk = blob \"\\99\\99\\99\\77\";
    fileId = $FileId;
    index = 0 : nat;
    retry = false;
  },
)"

echo "... Refreshing the status of the proposals and performing the corresponding executions"
# echo "⏳ Waiting for 10 seconds before uploading file chunk..."
# sleep 10

# dfx canister call motokoDao refresh_all_proposals

echo "📝 We register 10 more members and then the admin grants them the Guardian role to activate the consensus mechanism."

dfx identity list | grep -q "^000Guardian2$" || dfx identity new 000Guardian2
dfx identity use 000Guardian2
export PrincipalGuardian02=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity list | grep -q "^000Guardian3$" || dfx identity new 000Guardian3
dfx identity use 000Guardian3
export PrincipalGuardian03=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity list | grep -q "^000Guardian4$" || dfx identity new 000Guardian4
dfx identity use 000Guardian4
export PrincipalGuardian04=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity list | grep -q "^000Guardian5$" || dfx identity new 000Guardian5
dfx identity use 000Guardian5
export PrincipalGuardian05=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity list | grep -q "^000Guardian6$" || dfx identity new 000Guardian6
dfx identity use 000Guardian6
export PrincipalGuardian06=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity list | grep -q "^000Guardian7$" || dfx identity new 000Guardian7
dfx identity use 000Guardian7
export PrincipalGuardian07=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity list | grep -q "^000Guardian8$" || dfx identity new 000Guardian8
dfx identity use 000Guardian8
export PrincipalGuardian08=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity list | grep -q "^000Guardian9$" || dfx identity new 000Guardian9
dfx identity use 000Guardian9
export PrincipalGuardian09=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity list | grep -q "^000Guardian10$" || dfx identity new 000Guardian10
dfx identity use 000Guardian10
export PrincipalGuardian10=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity list | grep -q "^000Guardian11$" || dfx identity new 000Guardian11
dfx identity use 000Guardian11
export PrincipalGuardian11=$(dfx identity get-principal)
dfx canister call motokoDao create_member

dfx identity use 000Admin

echo " Admin 👉 granting them 🛡 Guardian 🛡 role to activate the consensus mechanism"

fallos=$(dfx canister call motokoDao batch_update_member_role "(
  vec {
    principal \"$PrincipalGuardian02\";
    principal \"$PrincipalGuardian03\";
    principal \"$PrincipalGuardian04\";
    principal \"$PrincipalGuardian05\";
    principal \"$PrincipalGuardian06\";
    principal \"$PrincipalGuardian07\";
    principal \"$PrincipalGuardian08\";
    principal \"$PrincipalGuardian09\";
    principal \"$PrincipalGuardian10\";
    principal \"$PrincipalGuardian11\";
  },
  variant { Guardian },
)")

echo "👌 Cantidad de fallos: $fallos "

# echo " Admin creates a new proposal  "
# now=$(echo $(dfx canister call motokoDao time) | awk '{print $1}' | tr -d '()_')
# newTaongaProposal=$(dfx canister call motokoDao create_proposal "(
#   record {
#     title = \"From CLI. Admin push a Proposal for a new Taonga \";
#     kind = variant {
#       DigitalTaonga = variant {
#         CreateDigitalTaonga = record {
#           thumbnail = blob \"\\00\\01\\02\\03\\04\\05\\06\\07\";
#           name = \"Test Consensus\";
#           description = \"Test Description \";
#           deadline = $((now + 20000000000 )): int;
#           history = \"Test History Taonga\";
#           dataSize = 12 : nat;
#           chunksQty = 1 : nat;
#           imageID = 0 : nat;
#         }
#       }
#     };
#     description = \"This time it will be approved or not by vote.\";
#     deadline = 0 : int;
#   },
# )")

# fileId=$(echo "$newTaongaProposal" | grep -o 'id = [0-9_]\+' | head -n 1 | awk '{print $NF}' | tr -d '_')

# dfx canister call motokoDao uploadFileChunk "(
#   record {
#     chunk = blob \"\\00\\01\\02\\03\\04\\05\\06\\07\\80\\09\\10\\11\";
#     fileId = $fileId;
#     index = 0 : nat;
#     retry = false;
#   },
# )"

# echo "Response from create_proposal: $CreateTaongaProposal"

exit 0