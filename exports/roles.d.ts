export default class Roles {
    #private;
    constructor(roles: {
        [index: string]: address[];
    });
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
