import TokenReceiver, { TokenReceiverState } from '../token-receiver.js';
export type VoteResult = 0 | 0.5 | 1;
export type PublicVote = {
    title: string;
    method: string;
    args: any[];
    description: string;
    endTime: EpochTimeStamp;
    results?: {
        [address: address]: VoteResult;
    };
    finished?: boolean;
    enoughVotes?: boolean;
};
export interface PublicVotingState extends TokenReceiverState {
    votes: {
        [id: string]: PublicVote;
    };
    votingDisabled: boolean;
}
export interface VoteView extends PublicVote {
    id: string;
}
/**
 * allows everybody that has a balance greater or equeal then/to tokenAmountToReceive to vote
 */
export default class PublicVoting extends TokenReceiver {
    #private;
    constructor(tokenToReceive: address, tokenAmountToReceive: typeof BigNumber, state: PublicVotingState);
    get votes(): {
        [x: string]: PublicVote;
    };
    get votingDisabled(): boolean;
    /**
     *
     */
    get state(): PublicVotingState;
    get inProgress(): VoteView[];
    /**
     * create vote
     * @param {string} vote
     * @param {string} description
     * @param {number} endTime
     * @param {string} method function to run when agree amount is bigger
     */
    createVote(title: string, description: string, endTime: EpochTimeStamp, method: string, args?: any[]): void;
    canVote(address: address): Promise<boolean>;
    vote(voteId: string, vote: VoteResult): Promise<void>;
    disableVoting(): void;
    sync(): void;
}
