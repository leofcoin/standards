import { restoreApprovals, restoreBalances } from './helpers.js'
import Roles from './roles.js'

export declare type TokenState = {
  roles: { [index: string]: address[] }
  holders: BigNumberish
  balances: { [address: address]: BigNumberish }
  approvals: { [owner: address]: { [operator: address]: BigNumberish } }
  totalSupply: BigNumberish
}

export default class Token extends Roles {
  /**
   * string
   */
  #name: string
  /**
   * String
   */
  #symbol: string
  /**
   * uint
   */
  #holders: typeof BigNumber = BigNumber['from'](0)
  /**
   * Object => Object => uint
   */
  #balances = {}
  /**
   * Object => Object => uint
   */
  #approvals: { [owner: string]: { [operator: string]: typeof BigNumber } } = {}

  #decimals = 18

  #totalSupply: typeof BigNumber = BigNumber['from'](0)

  // this.#privateField2 = 1
  constructor(name: string, symbol: string, decimals: number = 18, state?: TokenState) {
    if (!name) throw new Error(`name undefined`)
    if (!symbol) throw new Error(`symbol undefined`)

    super(state?.roles)

    if (state) {
      this.#balances = restoreBalances(state.balances)
      this.#approvals = restoreApprovals(state.approvals)
      this.#holders = BigNumber['from'](state.holders)
      this.#totalSupply = BigNumber['from'](state.totalSupply)
    } else {
      this.#name = name
      this.#symbol = symbol
      this.#decimals = decimals
    }
  }

  // enables snapshotting
  // needs dev attention so nothing breaks after snapshot happens
  // iow everything that is not static needs to be included in the stateObject
  /**
   * @return {Object} {holders, balances, ...}
   */
  get state(): {} {
    return {
      ...super.state,
      holders: this.holders,
      balances: this.balances,
      approvals: { ...this.#approvals },
      totalSupply: this.totalSupply
    }
  }

  get totalSupply(): BigNumberish {
    return this.#totalSupply
  }

  get name(): string {
    return this.#name
  }

  get symbol(): string {
    return this.#symbol
  }

  get holders(): {} {
    return this.#holders
  }

  get balances(): {} {
    return { ...this.#balances }
  }

  get approvals() {
    return this.#approvals
  }

  get decimals() {
    return this.#decimals
  }

  mint(to: address, amount: BigNumberish) {
    if (!this.hasRole(msg.sender, 'MINT')) throw new Error('not allowed')

    this.#totalSupply = this.#totalSupply.add(amount)
    this.#increaseBalance(to, amount)
  }

  burn(from: address, amount: BigNumberish) {
    if (!this.hasRole(msg.sender, 'BURN')) throw new Error('not allowed')

    this.#totalSupply = this.#totalSupply.sub(amount)
    this.#decreaseBalance(from, amount)
  }

  #beforeTransfer(from: address, to: address, amount: BigNumberish) {
    if (!this.#balances[from] || this.#balances[from] < amount) throw new Error('amount exceeds balance')
  }

  #updateHolders(address: address, previousBalance: typeof BigNumber) {
    if (this.#balances[address].toHexString() === '0x00') this.#holders.sub(1)
    else if (this.#balances[address].toHexString() !== '0x00' && previousBalance.toHexString() === '0x00')
      this.#holders.add(1)
  }

  #increaseBalance(address: address, amount: BigNumberish) {
    if (!this.#balances[address]) this.#balances[address] = BigNumber['from'](0)
    const previousBalance = this.#balances[address]

    this.#balances[address] = this.#balances[address].add(amount)
    this.#updateHolders(address, previousBalance)
  }

  #decreaseBalance(address: address, amount: BigNumberish) {
    const previousBalance = this.#balances[address]
    this.#balances[address] = this.#balances[address].sub(amount)
    this.#updateHolders(address, previousBalance)
  }

  balance() {
    return this.#balances[msg.sender]
  }

  balanceOf(address: address): BigNumberish {
    return this.#balances[address]
  }

  setApproval(operator: address, amount: BigNumberish) {
    const owner = msg.sender
    if (!this.#approvals[owner]) this.#approvals[owner] = {}
    this.#approvals[owner][operator] = BigNumber['from'](amount)
  }

  approved(owner: address, operator: address, amount: BigNumberish): boolean {
    return this.#approvals[owner][operator] === amount
  }

  transfer(from: address, to: address, amount: BigNumberish) {
    // TODO: is BigNumber?
    amount = BigNumber['from'](amount)
    this.#beforeTransfer(from, to, amount)
    this.#decreaseBalance(from, amount)
    this.#increaseBalance(to, amount)
  }
}
