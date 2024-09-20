/// <reference types="@leofcoin/types/global" />
import Roles, { RolesState } from './roles.js';
export declare interface TokenState extends RolesState {
    name: string;
    symbol: string;
    decimals: number;
    holders: bigint;
    balances: {
        [address: address]: bigint;
    };
    approvals: {
        [owner: address]: {
            [operator: address]: bigint;
        };
    };
    totalSupply: bigint;
    maxSupply: bigint;
}
export default class Token extends Roles {
    #private;
    constructor(name: string, symbol: string, decimals?: number, state?: TokenState);
    /**
     * @return {Object} {holders, balances, ...}
     */
    get state(): TokenState;
    get maxSupply(): TokenState['maxSupply'];
    get totalSupply(): TokenState['totalSupply'];
    get name(): TokenState['name'];
    get symbol(): TokenState['symbol'];
    get holders(): TokenState['holders'];
    get balances(): TokenState['balances'];
    get approvals(): TokenState['approvals'];
    get decimals(): TokenState['decimals'];
    mint(to: address, amount: bigint): void;
    burn(from: address, amount: bigint): void;
    balance(): any;
    balanceOf(address: address): bigint;
    setApproval(operator: address, amount: bigint): void;
    approved(owner: address, operator: address, amount: bigint): boolean;
    transfer(from: address, to: address, amount: bigint): void;
}
