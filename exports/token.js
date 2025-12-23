import { restoreBalances, restoreApprovals } from './helpers.js';
import Roles from './roles.js';
import './meta-D7uruGOw.js';

class Token extends Roles {
    /**
     * string
     */
    #name;
    /**
     * String
     */
    #symbol;
    /**
     * uint
     */
    #holders = 0n;
    /**
     * Object => Object => uint
     */
    #balances = {};
    /**
     * Object => Object => uint
     */
    #approvals = {};
    #decimals = 18;
    #totalSupply = 0n;
    constructor(name, symbol, decimals = 18, state) {
        if (!name)
            throw new Error(`name undefined`);
        if (!symbol)
            throw new Error(`symbol undefined`);
        super(state);
        if (state) {
            this.#balances = restoreBalances(state.balances);
            this.#approvals = restoreApprovals(state.approvals);
            this.#holders = BigInt(state.holders);
            this.#totalSupply = BigInt(state.totalSupply);
        }
        else {
            this.#name = name;
            this.#symbol = symbol;
            this.#decimals = decimals;
        }
    }
    // enables snapshotting
    // needs dev attention so nothing breaks after snapshot happens
    // iow everything that is not static needs to be included in the stateObject
    /**
     * @return {Object} {holders, balances, ...}
     */
    get state() {
        return {
            ...super.state,
            holders: this.holders,
            balances: this.balances,
            approvals: { ...this.#approvals },
            totalSupply: this.totalSupply
        };
    }
    get totalSupply() {
        return this.#totalSupply;
    }
    get name() {
        return this.#name;
    }
    get symbol() {
        return this.#symbol;
    }
    get holders() {
        return this.#holders;
    }
    get balances() {
        return { ...this.#balances };
    }
    get approvals() {
        return this.#approvals;
    }
    get decimals() {
        return this.#decimals;
    }
    mint(to, amount) {
        if (!this.hasRole(msg.sender, 'MINT'))
            throw new Error('not allowed');
        this.#totalSupply = this.#totalSupply + amount;
        this.#increaseBalance(to, amount);
    }
    burn(from, amount) {
        if (!this.hasRole(msg.sender, 'BURN'))
            throw new Error('not allowed');
        this.#totalSupply = this.#totalSupply - amount;
        this.#decreaseBalance(from, amount);
    }
    #beforeTransfer(from, to, amount) {
        if (!this.#balances[from] || this.#balances[from] < amount)
            throw new Error('amount exceeds balance');
    }
    #updateHolders(address, previousBalance) {
        if (this.#balances[address] === 0n)
            this.#holders -= 1n;
        else if (this.#balances[address] !== 0n && previousBalance === 0n)
            this.#holders += 1n;
    }
    #increaseBalance(address, amount) {
        if (!this.#balances[address])
            this.#balances[address] = 0n;
        const previousBalance = this.#balances[address];
        this.#balances[address] = this.#balances[address] + amount;
        this.#updateHolders(address, previousBalance);
    }
    #decreaseBalance(address, amount) {
        const previousBalance = this.#balances[address];
        this.#balances[address] = this.#balances[address] - amount;
        this.#updateHolders(address, previousBalance);
    }
    balance() {
        return this.#balances[msg.sender];
    }
    balanceOf(address) {
        return this.#balances[address];
    }
    setApproval(operator, amount) {
        const owner = msg.sender;
        if (!this.#approvals[owner])
            this.#approvals[owner] = {};
        this.#approvals[owner][operator] = BigInt(amount);
    }
    approved(owner, operator, amount) {
        return this.#approvals[owner][operator] === amount;
    }
    transfer(from, to, amount) {
        // TODO: is bigint?
        amount = BigInt(amount);
        this.#beforeTransfer(from, to, amount);
        this.#decreaseBalance(from, amount);
        this.#increaseBalance(to, amount);
    }
}

export { Token as default };
