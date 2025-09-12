#!/bin/bash
dfx stop
dfx start --clean --background
dfx deploy motokoDao

dfx identity list | grep -q "^000Admin$" || dfx identity new 000Admin
export PrincipalAdmin=$(dfx identity get-principal --identity 000Admin)

dfx identity list | grep -q "^000Guardian1$" || dfx identity new 000Guardian1
export PrincipalGuardian01=$(dfx identity get-principal --identity 000Guardian1)

dfx identity list | grep -q "^000Guardian2$" || dfx identity new 000Guardian2
export PrincipalGuardian02=$(dfx identity get-principal --identity 000Guardian2)

dfx identity use 000Admin

firtsMember=$(dfx canister call motokoDao create_member)

if echo "$firtsMember" | grep -q 'role = variant { Admin }'; then
    echo "✅ Successful role test: The first member's role is Admin."
else
    echo "❌ Role test failed: The first member's role is not Admin."
fi

dfx identity use 000Guardian1
secondMember=$(dfx canister call motokoDao create_member)

if echo "$secondMember" | grep -q 'role = variant { Viewer }'; then
    echo "✅ Successful role test: The second member's role is Viewer."
else
    echo "❌ Role test failed: The second member's role is not Viwer."
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

dfx canister call motokoDao create_proposal "(
  record {
    title = \"Test\";
    kind = variant {
      Guardian = variant {
        AssignRole = record {
          member = principal \"$PrincipalGuardian01\";
          role = variant { Guardian };
          deadline = 0 : int;
        }
      }
    };
    description = \"Test Admin proposal without Guardians\";
    deadline = 0 : int;
  },
)"

echo "... Refreshing the status of the proposals and performing the corresponding executions"
dfx canister call motokoDao refresh_all_proposals

updatedRoleSecondMember=$(dfx canister call motokoDao get_member "(principal \"$PrincipalGuardian01\")")
if echo "$updatedRoleSecondMember" | grep -q 'role = variant { Guardian }'; then
    echo "✅ Successful update role test: The Admin successfully granted the Guardian role to the second member via proposal."
else
    echo "❌ Update Role test failed: The second member's role is not Guardian."
fi

echo "Test push proposal to create taonga from admin whitout votation instance"

dfx canister call motokoDao create_proposal "(
  record {
    title = \"Taonga\";
    kind = variant {
      DigitalTaonga = variant {
        CreateDigitalTaonga = record {
          thumbnail = blob \"\\00\\11\\33\\44\";
          name = \"Test Create Taonga\";
          description = \"Test Description \";
          deadline = 0 : int;
          history = \"Test History Taonga\";
          dataSize = 10 : nat;
          chunksQty = 1 : nat;
          imageID = 0 : nat;
        }
      }
    };
    description = \"Test Proposal create taonga\";
    deadline = 0 : int;
  },
)"

echo "... Refreshing the status of the proposals and performing the corresponding executions"
dfx canister call motokoDao refresh_all_proposals




exit 0

