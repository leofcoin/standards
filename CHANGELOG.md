# @leofcoin/standards

## Unreleased

### Changed

- Refactored TokenReceiver to use native `bigint` instead of `BigNumber`
- Updated comparison operators to use native BigInt comparisons (`>=`, `>`, `===`)

### Added

- GitHub Actions workflow for automated testing across Node.js versions 18.x, 20.x, 22.x
- Test status badge in README
- Comprehensive unit tests for helpers, roles, token, and voting modules
- Meta base class for state management

### Fixed

- Test script glob pattern in package.json
- Build step added to CI workflow for proper test execution

## 0.2.1

### Patch Changes

- 6073f7d: interface/public-voting -> interfaces/i-public-voting

## 0.2.0

### Minor Changes

- Add voting & tokenReceiver
