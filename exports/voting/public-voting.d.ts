import Meta from '../meta.js';
import { VotingState, VoteResult } from '../interfaces.js';
/**
 * allows everybody that has a balance greater or equal to tokenAmountToReceive to vote
 */
export default class PublicVoting extends Meta {
    #private;
    constructor(state: VotingState);
    get votes(): {
        [id: string]: import("../interfaces.js").Vote;
    };
    get votingDuration(): number;
    get votingDisabled(): boolean;
    /**
     *
     */
    get state(): {
        votes: {
            [id: string]: import("../interfaces.js").Vote;
        };
        votingDisabled: boolean;
        votingDuration: number;
    };
    get inProgress(): {
        id: string;
        title: string;
        method: string;
        args: any[];
        description: string;
        endTime: EpochTimeStamp;
        results?: {
            [address: string]: VoteResult;
        };
        finished?: boolean;
        enoughVotes?: boolean;
    }[];
    /**
     * create vote
     * @param {string} vote
     * @param {string} description
     * @param {number} endTime
     * @param {string} method function to run when agree amount is bigger
     */
    createVote(title: string, description: string, endTime: EpochTimeStamp, method: string, args?: any[]): void;
    vote(voteId: string, vote: VoteResult): Promise<void>;
    disableVoting(): void;
    _sync(): void;
}
