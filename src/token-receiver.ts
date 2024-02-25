export interface TokenReceiverState {
  tokenToReceive: address
  tokenAmountToReceive: typeof BigNumber
}
export default class TokenReceiver {
  #tokenToReceive: address
  #tokenAmountToReceive: typeof BigNumber
  constructor(tokenToReceive: address, tokenAmountToReceive: typeof BigNumber, state: TokenReceiverState) {
    if (state) {
      this.#tokenToReceive = state.tokenToReceive
      this.#tokenAmountToReceive = BigNumber['from'](state.tokenAmountToReceive)
    } else {
      this.#tokenToReceive = tokenToReceive
      this.#tokenAmountToReceive = BigNumber['from'](tokenAmountToReceive)
    }
  }

  get tokenToReceive() {
    return this.#tokenToReceive
  }

  get tokenAmountToReceive() {
    return this.#tokenAmountToReceive
  }

  get state() {
    return {
      tokenToReceive: this.#tokenToReceive,
      tokenAmountToReceive: this.#tokenAmountToReceive
    }
  }

  /**
   * check if sender can pay
   * @returns {boolean} promise
   */
  async canPay(): Promise<boolean> {
    const amount = (await msg.staticCall(this.#tokenToReceive, 'balanceOf', [msg.sender])) as typeof BigNumber
    return amount.gte(this.#tokenAmountToReceive)
  }
}
