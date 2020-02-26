[![Build Status](https://travis-ci.com/netsells/nuxt-non-pojo.svg?branch=master)](https://travis-ci.com/netsells/nuxt-non-pojo)
[![codecov](https://codecov.io/gh/netsells/nuxt-non-pojo/branch/master/graph/badge.svg)](https://codecov.io/gh/netsells/nuxt-non-pojo)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fnetsells%2Fnuxt-non-pojo%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/netsells/nuxt-non-pojo/master)

# Nuxt Non-POJO

Use non-POJO objects in NuxtJS with server side rendering.

## Usage

Add a plugin:

```javascript
    plugins: [
        '~/plugins/nuxt-non-pojo',
    ],
```

```javascript
// plugins/nuxt-non-pojo.js

import createPlugin from '@netsells/nuxt-non-pojo';
import { Foo, Bar } from '../models';

export default createPlugin({
    classes: [Foo, Bar],
});
```

### Save an object in data

```javascript
// With NuxtJS context
app.$nnp.save(foo);

// In a component

this.$nnp.save(foo);
```

### Read an object from data

```javascript
this.$nnp(foo)
```
