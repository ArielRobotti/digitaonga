use candid::{CandidType, Principal};
use ic_cdk::api::call::CallResult;
use serde::Deserialize;

pub struct Nft(Principal);

impl Nft {
    pub fn new(collection_id: Principal) -> Self {
        Self(collection_id)
    }

    #[allow(non_snake_case)]
    pub async fn icrcX_mint(
        &self,
        token_id: u128,
        owner: Principal,
        name: String,
        description: String,
        image: String,
    ) -> u128 {
        let mint_args: SetNftRequest = vec![SetNftItemRequest {
            token_id,
            owner: Some(Account {
                owner,
                subaccount: None,
            }),
            metadata: NftInput::Map(vec![(
                "icrc97:metadata".to_string(),
                Box::new(CandyShared::Map(vec![
                    ("name".to_string(), Box::new(CandyShared::Text(name))),
                    (
                        "description".to_string(),
                        Box::new(CandyShared::Text(description)),
                    ),
                    (
                        "assets".to_string(),
                        Box::new(CandyShared::Array(vec![Box::new(CandyShared::Map(vec![
                            ("url".to_string(), Box::new(CandyShared::Text(image))),
                            (
                                "mime".to_string(),
                                Box::new(CandyShared::Text("image/jpeg".to_string())), // TODO (fran): ver el mime type
                            ),
                            (
                                "purpose".to_string(),
                                Box::new(CandyShared::Text("icrc97:image".to_string())),
                            ),
                        ]))])),
                    ),
                ])),
            )]),
            memo: None,
            r#override: false,
            created_at_time: None,
        }];

        let mint_res: CallResult<(Vec<SetNftResult>,)> =
            ic_cdk::call(self.0, "icrcX_mint", (mint_args,)).await;

        let (res,) = mint_res.expect("Call icrcX_mint error.");
        let res = res.get(0).expect("No result in icrcX_mint response.");

        match res {
            SetNftResult::Ok(id) => id.expect("id = None."),
            SetNftResult::Err(err) => match err {
                SetNftError::GenericError {
                    message,
                    error_code,
                } => {
                    panic!(
                        "GenericError on icrcX_mint. Error code: {}. {}",
                        error_code, message
                    )
                }
                SetNftError::TokenExists => {
                    panic!("TokenExists on icrcX_mint.")
                }
                SetNftError::NonExistingTokenId => {
                    panic!("NonExistingTokenId on icrcX_mint.")
                }
                SetNftError::CreatedInFuture { ledger_time } => {
                    panic!(
                        "CreatedInFuture on icrcX_mint. Ledger time: {}",
                        ledger_time
                    )
                }
                SetNftError::TooOld => {
                    panic!("TooOld on icrcX_mint.")
                }
            },
            SetNftResult::GenericError {
                message,
                error_code,
            } => {
                panic!(
                    "GenericError on icrcX_mint. Error code: {}. {}",
                    error_code, message
                )
            }
        }
    }
}

pub type SetNftRequest = Vec<SetNftItemRequest>;

#[derive(CandidType, Deserialize)]
pub struct SetNftItemRequest {
    pub token_id: u128,
    pub owner: Option<Account>,
    pub metadata: NftInput,
    pub memo: Option<Vec<u8>>,
    pub r#override: bool,
    pub created_at_time: Option<u64>,
}

pub type Subaccount = Vec<u8>;
#[derive(CandidType, Deserialize)]
pub struct Account {
    pub owner: Principal,
    pub subaccount: Option<Subaccount>,
}

#[derive(CandidType, Deserialize)]
pub enum NftInput {
    Int(candid::Int),
    Map(Vec<(String, Box<CandyShared>)>),
    Nat(candid::Nat),
    Set(Vec<Box<CandyShared>>),
    Nat16(u16),
    Nat32(u32),
    Nat64(u64),
    Blob(Vec<u8>),
    Bool(bool),
    Int8(i8),
    Ints(Vec<candid::Int>),
    Nat8(u8),
    Nats(Vec<candid::Nat>),
    Text(String),
    Bytes(Vec<u8>),
    Int16(i16),
    Int32(i32),
    Int64(i64),
    Option(Option<Box<CandyShared>>),
    Floats(Vec<f64>),
    Float(f64),
    #[serde(rename = "Principal")]
    Principal_(Principal),
    Array(Vec<Box<CandyShared>>),
    ValueMap(Vec<(Box<CandyShared>, Box<CandyShared>)>),
    Class(Vec<PropertyShared>),
}

#[derive(CandidType, Deserialize)]
pub enum CandyShared {
    Int(candid::Int),
    Map(Vec<(String, Box<CandyShared>)>),
    Nat(candid::Nat),
    Set(Vec<Box<CandyShared>>),
    Nat16(u16),
    Nat32(u32),
    Nat64(u64),
    Blob(Vec<u8>),
    Bool(bool),
    Int8(i8),
    Ints(Vec<candid::Int>),
    Nat8(u8),
    Nats(Vec<candid::Nat>),
    Text(String),
    Bytes(Vec<u8>),
    Int16(i16),
    Int32(i32),
    Int64(i64),
    Option(Option<Box<CandyShared>>),
    Floats(Vec<f64>),
    Float(f64),
    #[serde(rename = "Principal")]
    Principal_(Principal),
    Array(Vec<Box<CandyShared>>),
    ValueMap(Vec<(Box<CandyShared>, Box<CandyShared>)>),
    Class(Vec<PropertyShared>),
}

#[derive(CandidType, Deserialize)]
pub struct PropertyShared {
    pub value: Box<CandyShared>,
    pub name: String,
    pub immutable: bool,
}

#[derive(CandidType, Deserialize)]
pub enum SetNftResult {
    Ok(Option<u128>),
    Err(SetNftError),
    GenericError {
        message: String,
        error_code: candid::Nat,
    },
}

#[derive(CandidType, Deserialize)]
pub enum SetNftError {
    GenericError {
        message: String,
        error_code: candid::Nat,
    },
    TokenExists,
    NonExistingTokenId,
    CreatedInFuture {
        ledger_time: u64,
    },
    TooOld,
}

#[derive(CandidType, Clone, Deserialize)]
pub struct LocalNft {
    collection_id: Principal,
    token_id: u128,
    owner: Principal,
    name: String,
    description: String,
    image: String,
    created_at: u64,
    last_update: u64,
}

impl LocalNft {
    pub fn new(
        collection_id: Principal,
        token_id: u128,
        owner: Principal,
        name: String,
        description: String,
        image: String,
    ) -> Self {
        let now = ic_cdk::api::time();
        Self {
            collection_id,
            token_id,
            owner,
            name,
            description,
            image,
            created_at: now,
            last_update: now,
        }
    }

    pub fn transfer(&mut self, owner: Principal) -> () {
        self.owner = owner;
        self.last_update = ic_cdk::api::time();
    }

    pub fn owner(&self) -> Principal {
        self.owner
    }
}
