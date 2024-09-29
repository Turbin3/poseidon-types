/*
Standard Types
*/

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
    has(has: { [key: string]: SystemAccount | TokenAccount | AssociatedTokenAccount | Signer | AccountInfo | Pubkey }): this
    getBump(): u8
    // Todo: Double check constraints syntax makes sense
    constraints(constraints: Constraint[]): this
    init(): void
    initIfNeeded(): void
    close(to: AccountInfo): void
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
    mintAuthority: Pubkey
    supply: u64
    decimals: u8
    isInitialized: boolean
    freezeAuthority?: Pubkey
    LEN: usize
    derive(seeds: Seeds): this
    deriveWithBump(seeds: Seeds, bump: u8): this
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
    balance: u64
    derive(seeds: Seeds, mint: Pubkey, authority: Pubkey, program?: Pubkey): this
    deriveWithBump(seeds: Seeds, mint: Pubkey, authority: Pubkey, bump: u8, program?: Pubkey): this
}

export class TokenProgram {
    static approve(
        to: AccountInfo, 
        delegate: AccountInfo, 
        authority: AccountInfo, 
        amount: u64
    ): Result

    static approveChecked(
        to: AccountInfo, 
        mint: AccountInfo, 
        delegate: AccountInfo, 
        authority: AccountInfo, 
        amount: u64, 
        decimals: u8
    ): Result

    static burn(
        mint: AccountInfo, 
        from: AccountInfo, 
        authority: AccountInfo, 
        amount: u64
    ): Result

    static closeAccount(
        account: AccountInfo, 
        destination: AccountInfo, 
        authority: AccountInfo
    ): Result

    static freezeAccount(
        account: AccountInfo,
        mint: AccountInfo,
        authority: AccountInfo
    ): Result

    // Implement initialize_account3 instead because initialize_account is deprecated
    static initializeAccount(
        account: AccountInfo,
        mint: AccountInfo,
        authority: AccountInfo
    ): Result
    
    // Implement initialize_mint2 instead because initialize_mint is deprecated
    static initializeMint(
        mint: AccountInfo,
        decimals: u8,
        authority: Pubkey,
        freezeAuthority?: Pubkey
    ): Result

    static mintTo(
        mint: AccountInfo, 
        to: AccountInfo, 
        authority: AccountInfo, 
        amount: u64
    ): Result

    static revoke(
        source: AccountInfo, 
        authority: AccountInfo
    ): Result

    static setAuthority(
        currentAuthority: AccountInfo,
        accountOrMint: AccountInfo,
        authorityType: AuthorityType,
        newAuthority?: Pubkey
    ): Result

    static syncNative(
        account: AccountInfo
    ): Result

    static thawAccount(
        account: AccountInfo,
        mint: AccountInfo,
        authority: AccountInfo
    ): Result

    static transfer(
        from: AccountInfo,
        to: AccountInfo,
        authority: AccountInfo,
        amount: u64,
        signingSeeds?: Seeds
    ): Result

    static transferChecked(
        from: AccountInfo,
        mint: AccountInfo,
        to: AccountInfo,
        authority: AccountInfo,
        amount: u64,
        decimals: u8,
        signingSeeds?: Seeds
    ): Result
}

/*
Associated Token Program
*/
export class AssociatedTokenAccount extends AccountInfo {
    derive(mint: Mint, authority: Pubkey): TokenAccount
}

/*
Numeric types
*/
declare abstract class Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array
}

declare class u8 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array;
}

declare class i8 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array;
}
declare class u16 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}
declare class i16 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}

declare class u32 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}

declare class i32 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}

declare class u64 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}

declare class i64 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}

declare class u128 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}

declare class i128 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}


declare class usize implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}

declare class isize implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}


declare class f32 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}

declare class f64 implements Numeric {
    constructor(number: number);
    add(number: this): this;
    sub(number: this): this;
    mul(number: this): this;
    div(number: this): this;
    min(number: this): this;
    max(number: this): this;
    eq(number: this): boolean;
    neq(number: this): boolean;
    lt(number: this): boolean;
    lte(number: this): boolean;
    gt(number: this): boolean;
    gte(number: this): boolean;  
    toBytes(be?: boolean): Uint8Array; 
}