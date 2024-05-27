export interface IVoting {
  _canVote?(): Promise<boolean> | boolean
  _beforeVote?(): Promise<void> | void
  _afterVote?(): Promise<void> | void
}
