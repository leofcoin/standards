import Roles from './roles.js';
import { TokenState } from './types.js';
export default class Token extends Roles {
    #private;
    constructor(name: string, symbol: string, decimals?: number, state?: TokenState);
    /**
     * @return {Object} {holders, balances, ...}
     */
    get state(): {};
    get totalSupply(): bigint;
    get name(): string;
    get symbol(): string;
    get holders(): {};
    get balances(): {};
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
