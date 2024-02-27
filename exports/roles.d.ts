import ContractCreator, { ContractCreatorState } from './contract-creator.js';
export interface RolesState extends ContractCreatorState {
    roles: {
        [index: string]: address[];
    };
}
export default class Roles extends ContractCreator {
    #private;
    constructor(state: any);
    /**
     *
     */
    get state(): RolesState;
    get roles(): {};
    /**
     * @param {address} address
     * @param {string} role
     * @returns true | false
     */
    hasRole(address: address, role: string): boolean;
    grantRole(address: address, role: string): void;
    revokeRole(address: address, role: string): void;
}
