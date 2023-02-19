import Roles from './roles.js';
export default class Token extends Roles {
    #private;
    constructor(name: string, symbol: string, decimals: number, state: {
        roles?: {};
    });
    /**
     * @return {Object} {holders, balances, ...}
     */
    get state(): {};
    get totalSupply(): any;
    get name(): string;
    get symbol(): string;
    get holders(): number;
    get balances(): {};
    mint(to: any, amount: any): void;
    burn(from: address, amount: BigNumber): void;
    balanceOf(address: address): BigNumber;
    setApproval(operator: address, amount: BigNumber): void;
    approved(owner: address, operator: address, amount: BigNumber): boolean;
    transfer(from: address, to: address, amount: BigNumber): void;
}
