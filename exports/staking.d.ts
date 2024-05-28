import Roles, { RolesState } from './roles.js';
export declare interface TokenState extends RolesState {
    holders: BigNumberish;
    balances: {
        [address: address]: BigNumberish;
    };
    approvals: {
        [owner: address]: {
            [operator: address]: BigNumberish;
        };
    };
    totalSupply: BigNumberish;
}
export default class Token extends Roles {
    #private;
    constructor(name: string, symbol: string, decimals?: number, state?: TokenState);
    /**
     * @return {Object} {holders, balances, ...}
     */
    get state(): TokenState;
    get totalSupply(): BigNumberish;
    get name(): string;
    get symbol(): string;
    get holders(): TokenState['holders'];
    get balances(): TokenState['balances'];
    get approvals(): {
        [owner: string]: {
            [operator: string]: import("@ethersproject/bignumber").BigNumber;
        };
    };
    get decimals(): number;
    mint(to: address, amount: BigNumberish): void;
    burn(from: address, amount: BigNumberish): void;
    balance(): any;
    balanceOf(address: address): BigNumberish;
    setApproval(operator: address, amount: BigNumberish): void;
    approved(owner: address, operator: address, amount: BigNumberish): boolean;
    transfer(from: address, to: address, amount: BigNumberish): void;
}
