import Meta, { MetaState } from './meta.js';
export interface RolesState extends MetaState {
    roles: {
        [index: string]: address[];
    };
}
export default class Roles extends Meta {
    #private;
    constructor(state?: RolesState);
    /**
     *
     */
    get state(): {};
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
