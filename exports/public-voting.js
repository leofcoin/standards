import { V as Voting } from './voting-xYjJlN2h.js';
import './contract-creator.js';

/**
 * allows everybody that has a balance greater or equeal then/to tokenAmountToReceive to vote
 */
class PublicVoting extends Voting {
    constructor(state) {
        super(state);
    }
}

export { PublicVoting as default };
