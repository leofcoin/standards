// when state is stored it get encoded as a string to  so we need to reformat balances back to BigNumbers
export const restoreBalances = (balances) => {
  const _balances = {}
  for (const address in balances) {
    _balances[address] = BigNumber['from'](balances[address])
  }
  return _balances
}

export const restoreApprovals = (approvals) => {
  const _approvals = {}
  for (const owner in approvals) {
    _approvals[owner] = {}
    for (const operator in approvals[owner]) {
      _approvals[owner][operator] = BigNumber['from'](approvals[owner][operator])
    }
  }
  return _approvals
}
