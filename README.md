# Fixt

> DOM test fixtures made as easy as they ought to be

## Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [License](#license)

## Installation

```sh
$ yarn add fixt
```

## Usage

```js
import test from 'fixt';

describe('text()', () => {
  it('returns the text content of an element', async () => {
    await test(
      `
      <p>Hello world!</p>
      `,
      p => assert(text(p) === 'Hello world!')
    )
  })
})
```

## License

Copyright &copy; 2017 [Kasper Kronborg Isager](https://github.com/kasperisager). Licensed under the terms of the [MIT license](LICENSE.md).
