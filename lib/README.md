
<a href="https://www.npmjs.com/package/watch-state">
  <img src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.3/img/logo.svg" align="left" width="90" height="90" alt="Watch-State logo by Mikhail Lysikov">
</a>

# &nbsp; @watch-state/api

&nbsp;

[![NPM](https://img.shields.io/npm/v/@watch-state/api.svg)](https://www.npmjs.com/package/@watch-state/api)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@watch-state/api)](https://bundlephobia.com/result?p=@watch-state/api)
[![downloads](https://img.shields.io/npm/dm/@watch-state/api.svg)](https://www.npmtrends.com/@watch-state/api)
[![changelog](https://img.shields.io/badge/changelog-⋮-brightgreen)](https://changelogs.xyz/@watch-state/api)
[![license](https://img.shields.io/npm/l/@watch-state/api)](https://github.com/d8corp/watch-state-api/blob/main/LICENSE)

Api with [watch-state](https://www.npmjs.com/package/watch-state)  
Based on [@watch-state/fetch](https://www.npmjs.com/package/@watch-state/fetch)

[![stars](https://img.shields.io/github/stars/d8corp/watch-state-api?style=social)](https://github.com/d8corp/watch-state-api/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state-api?style=social)](https://github.com/d8corp/watch-state-api/watchers)

### Install

npm
```bash
npm i @watch-state/api
```

yarn
```bash
yarn add @watch-state/api
```

### Usage

Use `Api` when you want to get data through API
```javascript
import Api from '@watch-state/api'

const user = new Api('https://reqres.in/api/users/{id}')
```

Use braces `{field}` for any dynamic data, so you can create any level API if you want
```javascript
import Api from '@watch-state/api'

const api = new Api('https://reqres.in/api/{module}/{id}')
```

Get [Fetch](https://www.npmjs.com/package/@watch-state/fetch) of the api with `get` method
```javascript
import Api from '@watch-state/api'

const user = new Api('https://reqres.in/api/user/{id}')

const user1 = user.get({ id: 1 })
```

You can use any option of [Fetch](https://www.npmjs.com/package/@watch-state/fetch)
with the second argument of `Api`

```javascript
import Api from '@watch-state/api'

const user = new Api('https://reqres.in/api/user/{id}', {
  default: {
    data: { id: null }
  }
})

user.get({ id: 1 }).value.data.id
// null

user.get({ id: 1 }).loaded
// false

await user.get({ id: 1 })

user.get({ id: 1 }).value.data.id
// 1
```

You can setup default `data` argument.

```javascript
const user = new Api('https://reqres.in/api/user/{id}', {
  data: {
    id: 1
  }
})

;(await user.get()).data.id
// 1

;(await user.get({id: 2})).data.id
// 2
```

You can override search params as well

```javascript
const users = new Api('https://reqres.in/api/users?page={page}', {
  data: {
    page: 1
  }
})

await users.get()
// request to https://reqres.in/api/users?page=1
```

Or you can provide additional fields for `get` method to add query search params

```javascript
const users = new Api('https://reqres.in/api/users', {
  data: {
    page: 1
  }
})

await users.get()
// request to https://reqres.in/api/users?page=1
```

### Cache invalidation

You can update all [Fetch](https://www.npmjs.com/package/@watch-state/fetch) instances of an `Api` with `update` method

```typescript jsx
import { Watch } from 'watch-state'
import { Api } from ' @watch-state/api'

const users = new Api('https://reqres.in/api/users?page={page}', {
  data: {
    page: 1
  }
})

new Watch(() => {
  console.log(users.get().value)
})

await users.get()

users.update()
```

You can update by object keys

```typescript jsx
import { Watch } from 'watch-state'
import { Api } from ' @watch-state/api'

const users = new Api('https://reqres.in/api/users', {
  getKeys: value => value.data.map(({id}) => id),
})

new Watch(() => {
  console.log(users.get().value)
})

await users.get()

users.update([10])
// nothing happens becase the first page do not contain the user with id equas 10

users.update([1])
```

### TypeScript

Api has 3 generics, the first one is a data type the request will return
```typescript
interface Responce {
  page: number
  per_page: number
  // ...
}

const users = new Api<Responce>('https://reqres.in/api/users')

console.log(users.get().value?.page)
```

The second generic is an error type you can get
```typescript
interface ResponceError {
  code: number
  message: string
}

const users = new Api<any, ResponceError>('https://reqres.in/api/users')

console.log(users.get().error?.message)
```

The last generic is a data you can provide to the `get` method

```typescript
interface Data {
  page: number
}

const users = new Api<any, any, Data>('https://reqres.in/api/users')

await users.get({ page: 1 })
```

When you don't need a data for the api, it's better to use [Fetch](https://www.npmjs.com/package/@watch-state/fetch)
instead of, but you can use `void` type to prevent any query options.

```typescript
const user = new Api<any, any, void>('https://reqres.in/api/users')

await user.get()
```

## Issues

If you find a bug, please file an issue on [GitHub](https://github.com/d8corp/watch-state-ajax/issues)  

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state-ajax)](https://github.com/d8corp/watch-state-ajax/issues)
