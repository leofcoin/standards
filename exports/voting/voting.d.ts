import ContractCreator from '../contract-creator.js';
import { Vote, VoteResult } from './types.js';
export default class Voting extends ContractCreator {
    #private;
    constructor(state: any);
    get votes(): {
        [x: string]: Vote;
    };
    get votingDuration(): number;
    get votingDisabled(): boolean;
    get state(): {
        votes: {
            [id: string]: Vote;
        };
        votingDisabled: boolean;
        votingDuration: number;
        contractCreator: string;
    };
    /**
     * create vote
     * @param {string} vote
     * @param {string} description
     * @param {number} endTime
     * @param {string} method function to run when agree amount is bigger
     */
    createVote(title: string, description: string, endTime: EpochTimeStamp, method: string, args?: any[]): void;
    vote(voteId: string, vote: VoteResult): Promise<void>;
    get votesInProgress(): {
        id: string;
        title: string;
        method: string;
        args: any[];
        description: string;
        endTime: number;
        results?: {
            [address: string]: VoteResult;
        };
        finished?: boolean;
        enoughVotes?: boolean;
    }[];
    disableVoting(): void;
    _sync(): void;
}
