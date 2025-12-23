import { MetaState } from '../types.js';
export interface VotingState extends MetaState {
    votes: {
        [id: string]: Vote;
    };
    votingDisabled: boolean;
    votingDuration: number;
}
export interface PrivateVotingState extends VotingState {
    voters: address[];
}
export type VoteResult = 0 | 0.5 | 1;
export type Vote = {
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
};
export interface VoteView extends Vote {
    id: string;
}
