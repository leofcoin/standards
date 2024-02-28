import PublicVoting from './public-voting.js';
import './contract-creator.js';

class TokenReceiver extends PublicVoting {
    #tokenToReceive;
    #tokenAmountToReceive;
    #tokenReceiver;
    #voteType = 'transfer';
    constructor(tokenToReceive, tokenAmountToReceive, burns, state) {
        super(state);
        if (state) {
            this.#tokenReceiver = state.tokenReceiver;
            this.#tokenToReceive = state.tokenToReceive;
            this.#tokenAmountToReceive = BigNumber['from'](state.tokenAmountToReceive);
            this.#voteType = state.voteType;
        }
        else {
            this.#tokenReceiver = msg.contract;
            this.#tokenToReceive = tokenToReceive;
            this.#tokenAmountToReceive = BigNumber['from'](tokenAmountToReceive);
            if (burns)
                this.#voteType = 'burn';
        }
    }
    get tokenToReceive() {
        return this.#tokenToReceive;
    }
    get tokenAmountToReceive() {
        return this.#tokenAmountToReceive;
    }
    get tokenReceiver() {
        return this.#tokenReceiver;
    }
    get state() {
        return {
            ...super.state,
            tokenReceiver: this.#tokenReceiver,
            tokenToReceive: this.#tokenToReceive,
            tokenAmountToReceive: this.#tokenAmountToReceive,
            voteType: this.#voteType
        };
    }
    async #canVote() {
        const amount = (await msg.staticCall(this.#tokenToReceive, 'balanceOf', [msg.sender]));
        return amount.gte(this.#tokenAmountToReceive);
    }
    /**
     * check if sender can pay
     * @returns {boolean} promise
     */
    async _canVote() {
        return this.#canVote();
    }
    async #beforeVote() {
        if (this.#voteType === 'burn')
            return msg.staticCall(this.tokenToReceive, 'burn', [this.tokenAmountToReceive]);
        return msg.staticCall(this.tokenToReceive, 'transfer', [msg.sender, this.tokenReceiver, this.tokenAmountToReceive]);
    }
    async _beforeVote() {
        await this.#beforeVote();
    }
    /**
     * check if sender can pay
     * @returns {boolean} promise
     */
    async _payTokenToReceive() {
        return msg.staticCall(this.#tokenToReceive, 'transfer', [
            msg.sender,
            this.#tokenReceiver,
            this.#tokenAmountToReceive
        ]);
    }
    /**
     * check if sender can pay
     * @returns {boolean} promise
     */
    async _burnTokenToReceive() {
        return msg.staticCall(this.#tokenToReceive, 'burn', [this.#tokenAmountToReceive]);
    }
    async _canPay() {
        const amount = await msg.call(this.#tokenToReceive, 'balance', []);
        return amount.gte(this.tokenAmountToReceive);
    }
    #changeTokenToReceive(address) {
        this.#tokenToReceive = address;
    }
    #changeTokenAmountToReceive(amount) {
        this.#tokenAmountToReceive = amount;
    }
    #changeVoteType(type) {
        this.#voteType = type;
    }
    #getTokensOut(amount, receiver) {
        return msg.call(this.#tokenReceiver, 'transfer', [this.#tokenReceiver, receiver, amount]);
    }
    async changeVoteType(type) {
        if (!this.#canVote())
            throw new Error('not a allowed');
        if (this.#voteType === 'transfer' && (await this.#balance()).gt(0))
            throw new Error('get tokens out first or they be lost forever');
        else {
            this.createVote(`change the token amount to receive`, `set tokenAmountToReceive`, new Date().getTime() + this.votingDuration, '#changeVoteType', [type]);
        }
    }
    getTokensOut(amount, receiver) {
        if (!this.#canVote())
            throw new Error('not a allowed');
        else {
            this.createVote(`withdraw all tokens`, `withdraw all tokens to ${receiver}`, new Date().getTime() + this.votingDuration, '#getTokensOut', [amount, receiver]);
        }
    }
    changeTokenAmountToReceive() {
        if (!this.#canVote())
            throw new Error('not a allowed');
        else {
            this.createVote(`change the token amount to receive`, `set tokenAmountToReceive`, new Date().getTime() + this.votingDuration, '#changeTokenAmountToReceive', []);
        }
    }
    #balance() {
        return msg.staticCall(this.#tokenToReceive, 'balanceOf', [this.#tokenReceiver]);
    }
    async changeTokenToReceive() {
        if (!this.#canVote())
            throw new Error('not a allowed');
        if (!(await this.#balance()).eq(0) && this.#voteType === 'transfer')
            throw new Error('get tokens out first or they be lost forever');
        else {
            this.createVote(`change the token to receive`, `set tokenToReceive to a new address`, new Date().getTime() + this.votingDuration, '#changeTokenToReceive', []);
        }
    }
}

export { TokenReceiver as default };
