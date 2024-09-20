import { restoreApprovals, restoreBalances } from './helpers.js'
import Roles, { RolesState } from './roles.js'

export declare interface TokenState extends RolesState {
  name: string
  symbol: string
  decimals: number
  holders: bigint
  balances: { [address: address]: bigint }
  approvals: { [owner: address]: { [operator: address]: bigint } }
  totalSupply: bigint
  maxSupply: bigint // 0 for unlimited
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
  #holders: bigint = BigInt(0)
  /**
   * Object => Object => uint
   */
  #balances = {}
  /**
   * Object => Object => uint
   */
  #approvals: { [owner: string]: { [operator: string]: bigint } } = {}

  #decimals = 18

  #totalSupply: bigint = BigInt(0)

  #maxSupply: bigint = BigInt(0)

  #stakingContract: address

  constructor(name: string, symbol: string, decimals: number = 18, state?: TokenState) {
    if (!name) throw new Error(`name undefined`)
    if (!symbol) throw new Error(`symbol undefined`)

    super(state)

    if (state) {
      this.#balances = restoreBalances(state.balances)
      this.#approvals = restoreApprovals(state.approvals)
      this.#holders = BigInt(state.holders)
      this.#totalSupply = BigInt(state.totalSupply)
      this.#name = name
      this.#symbol = symbol
      this.#decimals = decimals
      this.#maxSupply = BigInt(state.maxSupply)
    } else {
      this.#name = name
      this.#symbol = symbol
      this.#decimals = decimals
    }
  }

  // enables snapshotting
  // needs dev attention so nothing breaks after snapshot happens
  // iow everything that is not static needs to be included in the stateObject
  // TODO: implement snapshotting test
  /**
   * @return {Object} {holders, balances, ...}
   */
  get state(): TokenState {
    return {
      ...super.state,
      name: this.#name,
      symbol: this.#symbol,
      decimals: this.#decimals,
      holders: this.holders,
      balances: this.balances,
      approvals: { ...this.#approvals },
      totalSupply: this.totalSupply,
      maxSupply: this.#maxSupply
    }
  }

  get maxSupply(): TokenState['maxSupply'] {
    return this.#maxSupply
  }

  get totalSupply(): TokenState['totalSupply'] {
    return this.#totalSupply
  }

  get name(): TokenState['name'] {
    return this.#name
  }

  get symbol(): TokenState['symbol'] {
    return this.#symbol
  }

  get holders(): TokenState['holders'] {
    return this.#holders
  }

  get balances(): TokenState['balances'] {
    return { ...this.#balances }
  }

  get approvals(): TokenState['approvals'] {
    return this.#approvals
  }

  get decimals(): TokenState['decimals'] {
    return this.#decimals
  }

  mint(to: address, amount: bigint) {
    if (!this.hasRole(msg.sender, 'MINT')) throw new Error('mint role required')

    const supply = this.#totalSupply + amount
    if (this.#maxSupply === 0n) {
      this.#totalSupply = supply
      this.#increaseBalance(to, amount)
    } else {
      if (supply <= this.#maxSupply) {
        this.#totalSupply = supply
        this.#increaseBalance(to, amount)
      } else {
        throw new Error('amount exceeds max supply')
      }
    }
  }

  burn(from: address, amount: bigint) {
    if (!this.hasRole(msg.sender, 'BURN') && msg.sender !== from) throw new Error('not the owner or burn role required')
    if (this.#balances[from] < amount) throw new Error('amount exceeds balance')

    const total = this.#totalSupply - amount
    if (total >= 0) {
      this.#totalSupply = total
      this.#decreaseBalance(from, amount)
    } else {
      throw new Error('amount exceeds total supply')
    }
  }

  #beforeTransfer(from: address, to: address, amount: bigint) {
    if (!this.#balances[from] || this.#balances[from] < amount) throw new Error('amount exceeds balance')
  }

  #updateHolders(address: address, previousBalance: bigint) {
    if (this.#balances[address] === 0n) this.#holders -= 1n
    else if (this.#balances[address] !== 0n && previousBalance === 0n) this.#holders += 1n
  }

  #increaseBalance(address: address, amount: bigint) {
    if (!this.#balances[address]) this.#balances[address] = BigInt(0)
    const previousBalance = this.#balances[address]

    this.#balances[address] = this.#balances[address] += amount
    this.#updateHolders(address, previousBalance)
  }

  #decreaseBalance(address: address, amount: bigint) {
    const previousBalance = this.#balances[address]
    this.#balances[address] = this.#balances[address] -= amount
    this.#updateHolders(address, previousBalance)
  }

  balance() {
    return this.#balances[msg.sender]
  }

  balanceOf(address: address): bigint {
    return this.#balances[address]
  }

  setApproval(operator: address, amount: bigint) {
    const owner = msg.sender
    if (!this.#approvals[owner]) this.#approvals[owner] = {}
    this.#approvals[owner][operator] = BigInt(amount)
  }

  approved(owner: address, operator: address, amount: bigint): boolean {
    return this.#approvals[owner][operator] === amount
  }

  transfer(from: address, to: address, amount: bigint) {
    // TODO: is bigint?
    amount = BigInt(amount)
    this.#beforeTransfer(from, to, amount)
    this.#decreaseBalance(from, amount)
    this.#increaseBalance(to, amount)
  }
}
