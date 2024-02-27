# standards

> Contract standards

standards used in leofcoin chain kinda like erc20's but the native coin included

## install

```sh
npm i @leofcoin/standards
```

## usage

```js
import { Token } from '@leofcoin/standards'

class myCoolToken extends Token {
  constructor(state) {
    super('myCoolToken', 'MCT', 18, state)
  }
}
```
