import ContractCreator, { ContractCreatorState } from '../contract-creator.js'
import { IVoting } from './interfaces/i-voting.js'
import { VoteResult, VoteView, VotingState } from './types.js'
import Voting from './voting.js'

export interface PrivateVotingState extends VotingState, ContractCreatorState {
  voters: address[]
}

export default class PrivateVoting extends Voting implements IVoting {
  #voters: PrivateVotingState['voters']

  constructor(state: PrivateVotingState) {
    super(state)
    if (state) {
      this.#voters = state.voters
    } else {
      this.#voters = [msg.sender]
    }
  }

  get state(): PrivateVotingState {
    return {
      ...super.state,
      voters: this.#voters
    }
  }

  _canVote(): boolean {
    return this.#voters.includes(msg.sender)
  }

  #grantVotingPower(address) {
    this.#voters.push(address)
  }

  #revokeVotingPower(address) {
    this.#voters.splice(this.#voters.indexOf(address))
  }

  grantVotingPower(address: address, voteId: string) {
    if (this.#voters.length === 1 && this._canVote()) this.#grantVotingPower(address)
    else {
      this.createVote(
        `grant voting power to ${address}`,
        `Should we grant ${address} voting power?`,
        new Date().getTime() + this.votingDuration,
        '#grantVotingPower',
        [address]
      )
    }
  }

  revokeVotingPower(address: address, voteId: string) {
    if (!this._canVote()) throw new Error('not a allowed to vote')
    if (this.#voters.length === 1 && address === msg.sender && !this.votingDisabled)
      throw new Error('only one voter left, disable voting before making this contract voteless')
    if (this.#voters.length === 1) this.#revokeVotingPower(address)
    else {
      this.createVote(
        `revoke voting power for ${address}`,
        `Should we revoke ${address} it's voting power?`,
        new Date().getTime() + this.votingDuration,
        '#revokeVotingPower',
        [address]
      )
    }
  }
}
