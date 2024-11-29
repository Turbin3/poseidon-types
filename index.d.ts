/*
Standard Types
*/

import { ProgrammableConfig,CollectionDetails } from "./index";

export class Pubkey {
    constructor(id: string | Uint8Array)
    toBytes(be?: boolean): Uint8Array
}

export class PoseidonError {
    constructor(error: string)
}

export class Signer {
    public key: Pubkey;
}

type Seeds = Array<string | Uint8Array | Pubkey>

type Result = void | PoseidonError

/*
Accounts
*/
export class Constraint {
    constructor(condition: boolean, error?: PoseidonError)
}

export class AccountInfo {
    public key: Pubkey
    public lamports: u64
    public data: Uint8Array
    public owner: Pubkey
    public rent_epoch: u64
    public is_signer: boolean
    public is_writable: boolean
    public executable: boolean
    has(has: Array<SystemAccount | TokenAccount | AssociatedTokenAccount | Signer | AccountInfo | Pubkey>): this
    getBump(): u8
    // Todo: Double check constraints syntax makes sense
    constraints(constraints: Constraint[]): this
    init(payer: AccountInfo | SystemAccount | UncheckedAccount | Signer): void
    initIfNeeded(payer: AccountInfo | SystemAccount | UncheckedAccount | Signer): void
    close(to: AccountInfo | SystemAccount | UncheckedAccount | Signer): void
}

export class SystemAccount {
    public key: Pubkey
    public lamports: u64
    public data: Uint8Array
    public owner: Pubkey
    public rent_epoch: u64
    public is_signer: boolean
    public is_writable: boolean
    public executable: boolean
    getBump(): u8
    derive(seeds: Seeds, program?: Pubkey): AccountInfo
    deriveWithBump(seeds: Seeds, bump: u8, program?: Pubkey): AccountInfo
}

export class UncheckedAccount extends AccountInfo {
    derive(seeds: Seeds, program?: Pubkey): AccountInfo
    deriveWithBump(seeds: Seeds, bump: u8, program?: Pubkey): AccountInfo
}

export class Account extends AccountInfo {
    derive(seeds: Seeds, program?: Pubkey): AccountInfo
    deriveWithBump(seeds: Seeds, bump: u8, program?: Pubkey): AccountInfo
}

export class Metadata {
  key: Key; // Typically Key::MetadataV1
  update_authority: Pubkey;
  mint: Pubkey;
  name: String<30>;
  symbol: String<15>;
  uri: String<60>;
  seller_fee_basis_points: u16;
  creators: Option<Vec<Creator, 10>>;
  primary_sale_happened: boolean;
  is_mutable: boolean;
  edition_nonce: Option<u8>;
  token_standard: Option<TokenStandard>;
  collection: Option<Collection>;
  uses: Option<Uses>;
  collection_details: Option<CollectionDetails>;
  programmable_config: Option<ProgrammableConfig>;
  derive(seeds: Seeds, program?: Pubkey): AccountInfo;
  deriveWithBump(seeds: Seeds, bump: u8, program?: Pubkey): AccountInfo;
}
/*
System Program
*/
export class SystemProgram {
    static transfer(
        from: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        to: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        amount: u64,
        signingSeeds?: Seeds
    ): Result
}
/*
Metadata Program
*/
export class MetadataProgram {
  static createMetadataAccountsV3(
    metadatav3: CreateMetadataV3,
    dataV2: DataV2,
    is_mutable:Boolean,
    update_authority_is_signer:Boolean, 
    collection_details : Option<Collection>
  ):Result;
}
/*
Token Program
*/

export enum AuthorityType {
    MintTokens,
    FreezeAccount,
    AccountOwner,
    CloseAccount
}

export enum AccountState {
    Uninitialized,
    Initialized,
    Frozen
}

export class Mint extends AccountInfo {
  mintAuthority: Pubkey;
  supply: u64;
  decimals: u8;
  isInitialized: boolean;
  freezeAuthority?: Pubkey;
  LEN: usize;
  derive(
    decimals: u8,
    authority: Pubkey,
    freezeAuthority: Pubkey,
    seeds?: Seeds
  ): this;
  deriveWithBump(
    decimals: u8,
    authority: Pubkey,
    freezeAuthority: Pubkey,
    seeds: Seeds,
    bump: u8
  ): this;
}

export class TokenAccount extends AccountInfo {
    mint: Pubkey
    owner: Pubkey
    amount: u64
    delegate?: Pubkey
    state: AccountState
    isNative?: u64
    delegatedAmount: u64
    closeAuthority?: Pubkey
    LEN: usize
    derive(seeds: Seeds, mint: Mint, authority: Pubkey, program?: Pubkey): this
    deriveWithBump(seeds: Seeds, mint: Mint, authority: Pubkey, bump: u8, program?: Pubkey): this
}

export class TokenProgram {
    static approve(
        to: AccountInfo, 
        delegate: AccountInfo, 
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer, 
        amount: u64,
        signingSeeds?: Seeds
    ): Result

    static approveChecked(
        to: AccountInfo,
        mint: AccountInfo | Mint, 
        delegate: AccountInfo, 
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer, 
        amount: u64, 
        decimals: u8,
        signingSeeds?: Seeds
    ): Result

    static burn(
        mint: AccountInfo | Mint, 
        from: AccountInfo | TokenAccount | AssociatedTokenAccount, 
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer, 
        amount: u64,
        signingSeeds?: Seeds
    ): Result

    static closeAccount(
        account: AccountInfo | TokenAccount | AssociatedTokenAccount, 
        destination: AccountInfo | SystemAccount | UncheckedAccount | Signer, 
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        signingSeeds?: Seeds
    ): Result

    static freezeAccount(
        account: AccountInfo | TokenAccount | AssociatedTokenAccount,
        mint: AccountInfo | Mint,
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        signingSeeds?: Seeds
    ): Result

    // Implement initialize_account3 instead because initialize_account is deprecated
    static initializeAccount(
        account: AccountInfo | TokenAccount | AssociatedTokenAccount,
        mint: AccountInfo | Mint,
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        signingSeeds?: Seeds
    ): Result
    
    // Implement initialize_mint2 instead because initialize_mint is deprecated
    static initializeMint(
        mint: AccountInfo | Mint,
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        decimals: u8,
        freezeAuthority?: Pubkey,
        signingSeeds?: Seeds
    ): Result

    static mintTo(
        mint: AccountInfo | Mint, 
        to: AccountInfo | TokenAccount | AssociatedTokenAccount, 
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer, 
        amount: u64,
        signingSeeds?: Seeds
    ): Result

    static revoke(
        source: AccountInfo, 
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        signingSeeds?: Seeds
    ): Result

    static setAuthority(
        currentAuthority: AccountInfo,
        accountOrMint: AccountInfo,
        authorityType: AuthorityType,
        newAuthority?: Pubkey,
        signingSeeds?: Seeds
    ): Result

    static syncNative(
        account: AccountInfo,
        signingSeeds?: Seeds
    ): Result

    static thawAccount(
        account: AccountInfo,
        mint: AccountInfo | Mint,
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        signingSeeds?: Seeds
    ): Result

    static transfer(
        from: AccountInfo | TokenAccount | AssociatedTokenAccount,
        to: AccountInfo | TokenAccount | AssociatedTokenAccount,
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        amount: u64,
        signingSeeds?: Seeds,
    ): Result

    static transferChecked(
        from: AccountInfo | TokenAccount | AssociatedTokenAccount,
        mint: AccountInfo | Mint,
        to: AccountInfo | TokenAccount | AssociatedTokenAccount,
        authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
        amount: u64,
        decimals: u8,
        signingSeeds?: Seeds
    ): Result
}

/*
Associated Token Program
*/
export class AssociatedTokenAccount extends AccountInfo {
    mint: Pubkey
    owner: Pubkey
    amount: u64
    delegate?: Pubkey
    state: AccountState
    isNative?: u64
    delegatedAmount: u64
    closeAuthority?: Pubkey
    LEN: usize
    derive(mint: Mint, authority: Pubkey): TokenAccount
}

/*
String
*/
export class Str<N extends number> {
    length: N;
}

/*
boolean
*/
declare class Boolean {}

/*
vector
*/
export class Vec<T, N extends number> {
    type: T;
    length: N;
}
/*
Numeric types
*/
declare abstract class Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array
}

declare class u8 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class i8 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}
declare class u16 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}
declare class i16 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class u32 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class i32 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class u64 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class i64 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class u128 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class i128 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}


declare class usize implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class isize implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}


declare class f32 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class f64 implements Numeric {
    constructor(number: number);
    add(number: number): this;
    sub(number: number): this;
    mul(number: number): this;
    div(number: number): this;
    min(number: number): this;
    max(number: number): this;
    eq(number: number): boolean;
    neq(number: number): boolean;
    lt(number: number): boolean;
    lte(number: number): boolean;
    gt(number: number): boolean;
    gte(number: number): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

/**
 * Represents an option of type `T` that has a value.
 *
 * @see {@link Option}
 * @category Utils — Options
 */
export type Some<T> = { __option: 'Some'; value: T };

/**
 * Represents an option of type `T` that has no value.
 *
 * @see {@link Option}
 * @category Utils — Options
 */
export type None = { __option: 'None' };

/**
 * An implementation of the Rust Option type in JavaScript.
 * It can be one of the following:
 * - <code>{@link Some}<T></code>: Meaning there is a value of type T.
 * - <code>{@link None}</code>: Meaning there is no value.
 */
export type Option<T> = Some<T> | None;

export enum UseMethod {
    Burn,
    Multiple,
    Single,
}

export enum Key {
  Uninitialized,
  EditionV1,
  MasterEditionV1,
  ReservationListV1,
  MetadataV1,
  ReservationListV2,
  MasterEditionV2,
  EditionMarker,
  UseAuthorityRecord,
  CollectionAuthorityRecord,
  TokenOwnedEscrow,
  TokenRecord,
  MetadataDelegate,
  EditionMarkerV2,
  HolderDelegate,
}

export enum TokenStandard {
  NonFungible,
  FungibleAsset,
  Fungible,
  NonFungibleEdition,
  ProgrammableNonFungible,
  ProgrammableNonFungibleEdition,
}

export class Uses {
    constructor(
        use_method: UseMethod,
        remaining: u64,
        total: u64
    )
}

export class Collection {
    constructor(
        verified: Boolean,
        key: Pubkey,
    )
}

export class Creator {
    constructor(
        key: Pubkey,
        verified: Boolean,
        share:u8,
    )
}
export class DataV2  {
    constructor(
        name:string,
        symbol:string,
        uri:string,
        seller_fee_basis_points:u16,
        creators: Option<Vec<Creator,10>>,
        collection: Option<Collection>,
        uses: Option<Uses>
    )
}

export class CreateMetadataV3 {
  constructor(
    payer: AccountInfo | SystemAccount | UncheckedAccount | Signer,
    mint_authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
    update_authority: AccountInfo | SystemAccount | UncheckedAccount | Signer,
    mint: Mint,
  );
}

