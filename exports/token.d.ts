import Roles from './roles.js';
export declare type TokenState = {
    roles: {
        [index: string]: address[];
    };
    holders: number;
    balances: {
        [index: string]: BigNumberish;
    };
    approvals: {};
    totalSupply: BigNumberish;
};
export default class Token extends Roles {
    #private;
    constructor(name: string, symbol: string, decimals?: number, state?: TokenState);
    /**
     * @return {Object} {holders, balances, ...}
     */
    get state(): {};
    get totalSupply(): BigNumberish;
    get name(): string;
    get symbol(): string;
    get holders(): {};
    get balances(): {};
    get decimals(): number;
    mint(to: address, amount: BigNumberish): void;
    burn(from: address, amount: BigNumberish): void;
    balanceOf(address: address): BigNumberish;
    setApproval(operator: address, amount: BigNumberish): void;
    approved(owner: address, operator: address, amount: BigNumberish): boolean;
    transfer(from: address, to: address, amount: BigNumberish): void;
}
