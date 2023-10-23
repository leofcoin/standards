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
    get totalSupply(): BigNumberish;
    get name(): string;
    get symbol(): string;
    get holders(): {};
    get balances(): {};
    mint(to: address, amount: BigNumberish): void;
    burn(from: address, amount: BigNumberish): void;
    balanceOf(address: address): BigNumberish;
    setApproval(operator: address, amount: BigNumberish): void;
    approved(owner: address, operator: address, amount: BigNumberish): boolean;
    transfer(from: address, to: address, amount: BigNumberish): void;
}
