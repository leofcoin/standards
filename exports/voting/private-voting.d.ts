import { VoteResult, VoteView, VotingState } from './types.js';
export interface PrivateVotingState extends VotingState {
    voters: any;
}
export default class PrivateVoting {
    #private;
    constructor(state: PrivateVotingState);
    get votes(): {
        [x: string]: import("./types.js").Vote;
    };
    get voters(): any;
    get votingDisabled(): boolean;
    /**
     *
     */
    get state(): {};
    get inProgress(): VoteView[];
    /**
     * create vote
     * @param {string} vote
     * @param {string} description
     * @param {number} endTime
     * @param {string} method function to run when agree amount is bigger
     */
    createVote(title: string, description: string, endTime: EpochTimeStamp, method: string, args?: any[]): void;
    canVote(address: address): any;
    vote(voteId: string, vote: VoteResult): void;
    disableVoting(): void;
    grantVotingPower(address: address, voteId: string): void;
    revokeVotingPower(address: address, voteId: string): void;
    sync(): void;
}
