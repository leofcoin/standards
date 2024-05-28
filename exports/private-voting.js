import { V as Voting } from './voting-xYjJlN2h.js';
import './contract-creator.js';

class PrivateVoting extends Voting {
    #voters;
    constructor(state) {
        super(state);
        if (state) {
            this.#voters = state.voters;
        }
        else {
            this.#voters = [msg.sender];
        }
    }
    get state() {
        return {
            ...super.state,
            voters: this.#voters
        };
    }
    _canVote() {
        return this.#voters.includes(msg.sender);
    }
    #grantVotingPower(address) {
        this.#voters.push(address);
    }
    #revokeVotingPower(address) {
        this.#voters.splice(this.#voters.indexOf(address));
    }
    grantVotingPower(address, voteId) {
        if (this.#voters.length === 1 && this._canVote())
            this.#grantVotingPower(address);
        else {
            this.createVote(`grant voting power to ${address}`, `Should we grant ${address} voting power?`, new Date().getTime() + this.votingDuration, '#grantVotingPower', [address]);
        }
    }
    revokeVotingPower(address, voteId) {
        if (!this._canVote())
            throw new Error('not a allowed to vote');
        if (this.#voters.length === 1 && address === msg.sender && !this.votingDisabled)
            throw new Error('only one voter left, disable voting before making this contract voteless');
        if (this.#voters.length === 1)
            this.#revokeVotingPower(address);
        else {
            this.createVote(`revoke voting power for ${address}`, `Should we revoke ${address} it's voting power?`, new Date().getTime() + this.votingDuration, '#revokeVotingPower', [address]);
        }
    }
}

export { PrivateVoting as default };
