import { Option, Pubkey } from ".";
/**
 * Creates a new {@link Option} of type `T` that has a value.
 *
 * @see {@link Option}
 * @category Utils — Options
 */
export const some = <T>(value: T): Option<T> => ({ __option: "Some", value });

/**
 * Creates a new {@link Option} of type `T` that has no value.
 *
 * @see {@link Option}
 * @category Utils — Options
 */
export const none = <T>(): Option<T> => ({ __option: "None" });

export abstract class CollectionDetails {
  static V1(size: bigint): CollectionDetails {
    return { __kind: "V1", size };
  }

  static V2(padding: number[]): CollectionDetails {
    return { __kind: "V2", padding };
  }
}

export abstract class ProgrammableConfig {
  static V1(rule_set: Option<Pubkey>): ProgrammableConfig {
    return { __kind: "V1", rule_set };
  }
}