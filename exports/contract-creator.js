class ContractCreator {
    #creator;
    constructor(state) {
        if (state)
            this.#creator = state.contractCreator;
        else
            this.#creator = msg.sender;
    }
    get _contractCreator() {
        return this.#creator;
    }
    get state() {
        return { contractCreator: this.#creator };
    }
    get _isContractCreator() {
        return msg.sender === this.#creator;
    }
}

export { ContractCreator as default };
