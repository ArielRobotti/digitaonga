use candid::Principal;
use ic_cdk::api::call::CallResult;

pub struct DigitalAsset(Principal);

impl DigitalAsset {
    pub fn new(principal: Principal) -> Self {
        Self(principal)
    }

    pub async fn mint(&self, to: Principal, token_uri: String) {
        let tx: CallResult<(u128,)> = ic_cdk::call(self.0, "mint", (to, token_uri)).await;

        match tx {
            Ok((asset_id,)) => {
                ic_cdk::println!("Minted asset with ID: {}", asset_id);
            }
            Err(err) => {
                ic_cdk::println!("Failed to mint asset: {:?}", err);
            }
        }
    }

    // pub fn transfer_from() {}
}
