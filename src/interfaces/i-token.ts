interface IToken {
  mint?(to: string, amount: bigint): void
  burn?(from: string, amount: bigint): void
  transfer?(from: string, to: string, amount: bigint): void
  balance?(): bigint
  balanceOf?(address: string): bigint
  setApproval?(operator: string, amount: bigint): void
  approved?(owner: string, operator: string, amount: bigint): boolean
}
export { IToken }
