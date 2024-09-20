import { restoreBalances, restoreApprovals } from './helpers.js';
import Roles from './roles.js';
import './contract-creator.js';

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
    #holders = BigInt(0);
    /**
     * Object => Object => uint
     */
    #balances = {};
    /**
     * Object => Object => uint
     */
    #approvals = {};
    #decimals = 18;
    #totalSupply = BigInt(0);
    #maxSupply = BigInt(0);
    #stakingContract;
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
            this.#name = name;
            this.#symbol = symbol;
            this.#decimals = decimals;
            this.#maxSupply = BigInt(state.maxSupply);
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
    // TODO: implement snapshotting test
    /**
     * @return {Object} {holders, balances, ...}
     */
    get state() {
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
        };
    }
    get maxSupply() {
        return this.#maxSupply;
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
            throw new Error('mint role required');
        const supply = this.#totalSupply + amount;
        if (this.#maxSupply === 0n) {
            this.#totalSupply = supply;
            this.#increaseBalance(to, amount);
        }
        else {
            if (supply <= this.#maxSupply) {
                this.#totalSupply = supply;
                this.#increaseBalance(to, amount);
            }
            else {
                throw new Error('amount exceeds max supply');
            }
        }
    }
    burn(from, amount) {
        if (!this.hasRole(msg.sender, 'BURN') && msg.sender !== from)
            throw new Error('not the owner or burn role required');
        const total = this.#totalSupply - amount;
        if (total >= 0) {
            this.#totalSupply = total;
            this.#decreaseBalance(from, amount);
        }
        else {
            throw new Error('amount exceeds total supply');
        }
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
            this.#balances[address] = BigInt(0);
        const previousBalance = this.#balances[address];
        this.#balances[address] = this.#balances[address] += amount;
        this.#updateHolders(address, previousBalance);
    }
    #decreaseBalance(address, amount) {
        const previousBalance = this.#balances[address];
        this.#balances[address] = this.#balances[address] -= amount;
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
