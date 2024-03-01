import ContractCreator from './contract-creator.js';

class Roles extends ContractCreator {
    /**
     * Object => Array
     */
    #roles = {
        OWNER: [],
        MINT: [],
        BURN: []
    };
    constructor(state) {
        super(state);
        // allow devs to set their own roles but always keep the default ones included
        // also allows roles to be loaded from the stateStore
        // carefull when including the roles make sure to add the owner
        // because no roles are granted by default when using custom roles
        if (state?.roles) {
            if (state.roles instanceof Object) {
                this.#roles = { ...state.roles, ...this.#roles };
            }
            else {
                throw new TypeError(`expected roles to be an object`);
            }
        }
        else {
            // no roles given so fallback to default to the msg sender
            this.#grantRole(msg.sender, 'OWNER');
        }
    }
    /**
     *
     */
    get state() {
        return { ...super.state, roles: this.roles };
    }
    get roles() {
        return { ...this.#roles };
    }
    /**
     * @param {address} address
     * @param {string} role
     * @returns true | false
     */
    hasRole(address, role) {
        return this.#roles[role] ? this.#roles[role].includes(address) : false;
    }
    /**
     * @private
     * @param {address} address address to grant the role to
     * @param {string} role role to give
     */
    #grantRole(address, role) {
        if (this.hasRole(address, role))
            throw new Error(`${role} role already granted for ${address}`);
        this.#roles[role].push(address);
    }
    /**
     * remove role for address
     * @private
     * @param {address} address address to revoke role from
     * @param {string} role role to evoke
     */
    #revokeRole(address, role) {
        if (!this.hasRole(address, role))
            throw new Error(`${role} role already revoked for ${address}`);
        if (role === 'OWNER' && this.#roles[role].length === 1)
            throw new Error(`atleast one owner is needed!`);
        this.#roles[role].splice(this.#roles[role].indexOf(address));
    }
    grantRole(address, role) {
        if (!this.hasRole(address, 'OWNER'))
            throw new Error('Not allowed');
        this.#grantRole(address, role);
    }
    revokeRole(address, role) {
        if (!this.hasRole(address, 'OWNER'))
            throw new Error('Not allowed');
        this.#revokeRole(address, role);
    }
}

export { Roles as default };
