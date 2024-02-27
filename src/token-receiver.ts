import { IPublicVoting } from './voting/interfaces/i-public-voting.js'
import PublicVoting from './voting/public-voting.js'
import { VotingState } from './voting/types.js'

export interface TokenReceiverState extends VotingState {
  tokenToReceive: address
  tokenReceiver: address
  tokenAmountToReceive: typeof BigNumber
  voteType: 'burn' | 'transfer'
}
export default class TokenReceiver extends PublicVoting implements IPublicVoting {
  #tokenToReceive: address
  #tokenAmountToReceive: typeof BigNumber
  #tokenReceiver: address
  #voteType: TokenReceiverState['voteType'] = 'transfer'

  constructor(
    tokenToReceive: address,
    tokenAmountToReceive: typeof BigNumber,
    burns: boolean,
    state?: TokenReceiverState
  ) {
    super(state)
    if (state) {
      this.#tokenReceiver = state.tokenReceiver
      this.#tokenToReceive = state.tokenToReceive
      this.#tokenAmountToReceive = BigNumber['from'](state.tokenAmountToReceive)
      this.#voteType = state.voteType
    } else {
      this.#tokenReceiver = msg.contract
      this.#tokenToReceive = tokenToReceive
      this.#tokenAmountToReceive = BigNumber['from'](tokenAmountToReceive)
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
    const amount = (await msg.staticCall(this.#tokenToReceive, 'balanceOf', [msg.sender])) as typeof BigNumber
    return amount.gte(this.#tokenAmountToReceive)
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
    await this.#beforeVote()
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

  #changeTokenToReceive(address: address) {
    this.#tokenToReceive = address
  }

  #changeTokenAmountToReceive(amount: typeof BigNumber) {
    this.#tokenAmountToReceive = amount
  }

  #changeVoteType(type: TokenReceiverState['voteType']) {
    this.#voteType = type
  }

  #getTokensOut(amount: typeof BigNumber, receiver: address) {
    return msg.call(this.#tokenReceiver, 'transfer', [this.#tokenReceiver, receiver, amount])
  }

  async changeVoteType(type: TokenReceiverState['voteType']) {
    if (!this.#canVote()) throw new Error('not a allowed')
    if (this.#voteType === 'transfer' && (await this.#balance()).gt(0))
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

  getTokensOut(amount: typeof BigNumber, receiver: address) {
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

  #balance(): Promise<typeof BigNumber> {
    return msg.staticCall(this.#tokenToReceive, 'balanceOf', [this.#tokenReceiver])
  }

  async changeTokenToReceive() {
    if (!this.#canVote()) throw new Error('not a allowed')
    if (!(await this.#balance()).eq(0) && this.#voteType === 'transfer')
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
