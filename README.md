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
