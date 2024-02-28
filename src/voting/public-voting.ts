import ContractCreator, { ContractCreatorState } from '../contract-creator.js'
import { VotingState, VoteResult } from './types.js'
import Voting from './voting.js'

export declare interface PublicVotingState extends VotingState, ContractCreatorState {}

/**
 * allows everybody that has a balance greater or equeal then/to tokenAmountToReceive to vote
 */
export default class PublicVoting extends Voting {
  constructor(state: PublicVotingState) {
    super(state)
  }
}
