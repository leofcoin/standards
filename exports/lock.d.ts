/// <reference types="@leofcoin/types/global" />
import { RolesState } from './roles.js';
import { IVoting } from './voting/interfaces/i-voting.js';
import PublicVoting from './voting/public-voting.js';
export declare interface LockState extends RolesState {
    holders: bigint;
    balances: {
        [address: address]: bigint;
    };
    totalSupply: bigint;
}
export default class Lock extends PublicVoting implements IVoting {
    #private;
    constructor(name: string, symbol: string, decimals?: number, state?: LockState);
    /**
     * @return {Object} {holders, balances, ...}
     */
    get state(): LockState;
    get totalSupply(): bigint;
    get name(): string;
    get symbol(): string;
    get holders(): LockState['holders'];
    get balances(): LockState['balances'];
    get approvals(): {
        [owner: string]: {
            [operator: string]: bigint;
        };
    };
    get decimals(): number;
    mint(to: address, amount: bigint): void;
    burn(from: address, amount: bigint): void;
    balance(): any;
    balanceOf(address: address): bigint;
    setApproval(operator: address, amount: bigint): void;
    approved(owner: address, operator: address, amount: bigint): boolean;
    transfer(from: address, to: address, amount: bigint): void;
}
