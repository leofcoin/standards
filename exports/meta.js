import { chainTimestamp } from './helpers.js';

class Meta {
    #creator;
    #createdAt;
    constructor(state) {
        if (state) {
            this.#creator = state.creator;
            this.#createdAt = state.createdAt;
        }
        else {
            this.#creator = msg.sender;
            this.#createdAt = BigInt(chainTimestamp());
        }
    }
    /**
     * get state object for snapshotting
     */
    get state() {
        return { creator: this.#creator, createdAt: this.#createdAt };
    }
    get creator() {
        return this.#creator;
    }
    get createdAt() {
        return this.#createdAt;
    }
}

export { Meta as default };
