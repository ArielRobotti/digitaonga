use candid::{CandidType, Principal};
use ic_cdk::api::call::CallResult;
use serde::Deserialize;

// #[derive(CandidType, Clone)]
pub struct Nft(Principal);

impl Nft {
    pub fn init(canister_id: Principal) -> Self {
        Self(canister_id)
    }

    pub async fn icrc7_transfer(
        &self,
        to: Principal,
        token_id: u64,
    ) -> Result<TransferArg, std::fmt::Error> {
        let args: TransferArg = TransferArg {
            from_subaccount: None,
            to: Account {
                owner: to,
                subaccount: None,
            },
            token_id,
            memo: None,
            created_at_time: None,
        };

        let tx_res: CallResult<(TransferArg,)> =
            ic_cdk::call(self.0, "icrc7_transfer", (args,)).await;

        match tx_res {
            Ok(tx) => Ok(tx.0),
            Err(e) => panic!("icrc7_transfer method error.\nCode: {:?}. {}", e.0, e.1),
        }
    }

    pub async fn icrc37_approve_tokens(&self, token_id: u128, to: Principal) {

        // let args = {
        //     token_id,
        //     approval_info: {
        //         memo: None,
        //         from_subaccount: None,
        //         created_at_time: None,
        //         expires_at: None,
        //         spender: {owner:to, subaccount:None},
        //     }
        // };
    }
}

#[derive(CandidType, Clone, Deserialize)]
pub struct Account {
    owner: Principal,
    subaccount: Option<Vec<u8>>,
}

#[derive(CandidType, Clone, Deserialize)]
pub struct TransferArg {
    from_subaccount: Option<Vec<u8>>,
    to: Account,
    token_id: u64,
    memo: Option<Vec<u8>>,
    created_at_time: Option<u64>,
}
