export interface MetaState {
  creator: address
  createdAt: bigint
}

export declare interface RolesState extends MetaState {
  roles: { [index: string]: address[] }
}

export declare interface TokenState extends RolesState {
  holders: bigint
  balances: { [address: address]: bigint }
  approvals: { [owner: address]: { [operator: address]: bigint } }
  totalSupply: bigint
}
