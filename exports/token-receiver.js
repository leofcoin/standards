class TokenReceiver {
    #tokenToReceive;
    #tokenAmountToReceive;
    constructor(tokenToReceive, tokenAmountToReceive, state) {
        if (state) {
            this.#tokenToReceive = state.tokenToReceive;
            this.#tokenAmountToReceive = BigNumber['from'](state.tokenAmountToReceive);
        }
        else {
            this.#tokenToReceive = tokenToReceive;
            this.#tokenAmountToReceive = BigNumber['from'](tokenAmountToReceive);
        }
    }
    get tokenToReceive() {
        return this.#tokenToReceive;
    }
    get tokenAmountToReceive() {
        return this.#tokenAmountToReceive;
    }
    get state() {
        return {
            tokenToReceive: this.#tokenToReceive,
            tokenAmountToReceive: this.#tokenAmountToReceive
        };
    }
    /**
     * check if sender can pay
     * @returns {boolean} promise
     */
    async canPay() {
        const amount = (await msg.staticCall(this.#tokenToReceive, 'balanceOf', [msg.sender]));
        return amount.gte(this.#tokenAmountToReceive);
    }
}

export { TokenReceiver as default };
