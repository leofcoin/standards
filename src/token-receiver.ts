import { IVoting } from './voting/interfaces/i-voting.js'
import PublicVoting, { PublicVotingState } from './voting/public-voting.js'

export interface TokenReceiverState extends PublicVotingState {
  tokenToReceive: address
  tokenReceiver: address
  tokenAmountToReceive: bigint
  voteType: 'burn' | 'transfer'
}
export default class TokenReceiver extends PublicVoting implements IVoting {
  #tokenToReceive: address
  #tokenAmountToReceive: bigint
  #tokenReceiver: address
  #voteType: TokenReceiverState['voteType'] = 'transfer'

  constructor(tokenToReceive: address, tokenAmountToReceive: bigint, burns: boolean, state?: TokenReceiverState) {
    super(state)
    if (state) {
      this.#tokenReceiver = state.tokenReceiver
      this.#tokenToReceive = state.tokenToReceive
      this.#tokenAmountToReceive = BigInt(state.tokenAmountToReceive)
      this.#voteType = state.voteType
    } else {
      this.#tokenReceiver = msg.contract
      this.#tokenToReceive = tokenToReceive
      this.#tokenAmountToReceive = BigInt(tokenAmountToReceive)
      if (burns) this.#voteType = 'burn'
    }
  }

  get tokenToReceive() {
    return this.#tokenToReceive
  }

  get tokenAmountToReceive() {
    return this.#tokenAmountToReceive
  }

  get tokenReceiver() {
    return this.#tokenReceiver
  }

  get state() {
    return {
      ...super.state,
      tokenReceiver: this.#tokenReceiver,
      tokenToReceive: this.#tokenToReceive,
      tokenAmountToReceive: this.#tokenAmountToReceive,
      voteType: this.#voteType
    }
  }

  async #canVote() {
    const amount = (await msg.staticCall(this.#tokenToReceive, 'balanceOf', [msg.sender])) as bigint
    return amount >= this.#tokenAmountToReceive
  }

  /**
   * check if sender can pay
   * @returns {boolean} promise
   */
  async _canVote(): Promise<boolean> {
    return this.#canVote()
  }

  async #beforeVote(): Promise<any> {
    if (this.#voteType === 'burn') return msg.staticCall(this.tokenToReceive, 'burn', [this.tokenAmountToReceive])
    return msg.staticCall(this.tokenToReceive, 'transfer', [msg.sender, this.tokenReceiver, this.tokenAmountToReceive])
  }

  async _beforeVote(): Promise<any> {
    return this.#beforeVote()
  }

  /**
   * check if sender can pay
   * @returns {boolean} promise
   */
  async _payTokenToReceive(): Promise<boolean> {
    return msg.staticCall(this.#tokenToReceive, 'transfer', [
      msg.sender,
      this.#tokenReceiver,
      this.#tokenAmountToReceive
    ])
  }

  /**
   * check if sender can pay
   * @returns {boolean} promise
   */
  async _burnTokenToReceive(): Promise<boolean> {
    return msg.staticCall(this.#tokenToReceive, 'burn', [this.#tokenAmountToReceive])
  }

  async _canPay() {
    const amount = await msg.call(this.#tokenToReceive, 'balance', [])
    return amount.gte(this.tokenAmountToReceive)
  }

  #changeTokenToReceive(address: address) {
    this.#tokenToReceive = address
  }

  #changeTokenAmountToReceive(amount: bigint) {
    this.#tokenAmountToReceive = amount
  }

  #changeVoteType(type: TokenReceiverState['voteType']) {
    this.#voteType = type
  }

  #getTokensOut(amount: bigint, receiver: address) {
    return msg.call(this.#tokenReceiver, 'transfer', [this.#tokenReceiver, receiver, amount])
  }

  async changeVoteType(type: TokenReceiverState['voteType']) {
    if (!this.#canVote()) throw new Error('not a allowed')
    if (this.#voteType === 'transfer' && (await this.#balance()) > 0n)
      throw new Error('get tokens out first or they be lost forever')
    else {
      this.createVote(
        `change the token amount to receive`,
        `set tokenAmountToReceive`,
        new Date().getTime() + this.votingDuration,
        '#changeVoteType',
        [type]
      )
    }
  }

  getTokensOut(amount: bigint, receiver: address) {
    if (!this.#canVote()) throw new Error('not a allowed')
    else {
      this.createVote(
        `withdraw all tokens`,
        `withdraw all tokens to ${receiver}`,
        new Date().getTime() + this.votingDuration,
        '#getTokensOut',
        [amount, receiver]
      )
    }
  }

  changeTokenAmountToReceive() {
    if (!this.#canVote()) throw new Error('not a allowed')
    else {
      this.createVote(
        `change the token amount to receive`,
        `set tokenAmountToReceive`,
        new Date().getTime() + this.votingDuration,
        '#changeTokenAmountToReceive',
        []
      )
    }
  }

  #balance(): Promise<bigint> {
    return msg.staticCall(this.#tokenToReceive, 'balanceOf', [this.#tokenReceiver])
  }

  async changeTokenToReceive() {
    if (!this.#canVote()) throw new Error('not a allowed')
    if ((await this.#balance()) > 0n && this.#voteType === 'transfer')
      throw new Error('get tokens out first or they be lost forever')
    else {
      this.createVote(
        `change the token to receive`,
        `set tokenToReceive to a new address`,
        new Date().getTime() + this.votingDuration,
        '#changeTokenToReceive',
        []
      )
    }
  }
}
