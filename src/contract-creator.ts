export type ContractCreatorState = {
  contractCreator: address
}

export default class ContractCreator {
  #creator: address

  constructor(state: ContractCreatorState) {
    if (state) this.#creator = state.contractCreator
    else this.#creator = msg.sender
  }

  get _contractCreator() {
    return this.#creator
  }

  get state(): ContractCreatorState {
    return { contractCreator: this.#creator }
  }

  get _isContractCreator() {
    return msg.sender === this.#creator
  }
}
