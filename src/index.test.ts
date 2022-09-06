import 'isomorphic-fetch'
import { Watch } from 'watch-state'

import Api from '.'

describe('Api', () => {
  test('Api', async () => {
    const user = new Api('https://reqres.in/api/users/1')
    user.get({}).resolve({data: {id: 2}})
    await user
    expect(user.get().value.data.id).toBe(2)

    user.get().update()

    await user.get()

    expect(user.get().value.data.id).toBe(1)
  })
  test('test', async () => {
    const user = new Api('https://reqres.in/api/users/{user}')
    user.get({user: 1}).resolve({data: {id: 2}})
    await user
    expect(user.get({user: 1}).value.data.id).toBe(2)

    user.get({user: 1}).update()

    await user.get({user: 1})

    expect(user.get({user: 1}).value.data.id).toBe(1)
    expect(user.get({user: 2}).loaded).toBe(false)
  })
  test('test1', async () => {
    const user = new Api('https://reqres.in/api/users/{user}', {
      data: {
        user: 1
      }
    })

    await user.get()

    expect(user.get().value.data.id).toBe(1)

    await user.get({user: 2})

    expect(user.get({user: 2}).value.data.id).toBe(2)
  })
  test('test2', async () => {
    const user = new Api('https://reqres.in/api/users', {
      data: {
        page: 2
      }
    })

    await user.get()

    expect(user.get().value.page).toBe(2)
  })
  it('should update all requests', async () => {
    const users = new Api('https://reqres.in/api/users')
    const page1 = users.get()
    const page2 = users.get({ page: 2 })
    const watch = jest.fn()

    new Watch(() => {
      watch('page 1', page1.loading)
    })

    new Watch(() => {
      watch('page 2', page2.loading)
    })

    await Promise.all([ page1, page2 ])

    expect(watch).toBeCalledTimes(4)

    users.update()

    expect(watch).toBeCalledTimes(6)

    await Promise.all([ page1, page2 ])

    expect(watch).toBeCalledTimes(8)
  })
  it('should update by key', async () => {
    const users = new Api('https://reqres.in/api/users', {
      getKeys: value => value.data.map(({id}) => id)
    })
    const page1 = users.get()
    const page2 = users.get({ page: 2 })
    const watch = jest.fn()

    new Watch(() => {
      watch('page 1', page1.loading)
    })

    new Watch(() => {
      watch('page 2', page2.loading)
    })

    await Promise.all([ page1, page2 ])

    expect(watch).toBeCalledTimes(4)

    users.update([1])

    expect(watch).toBeCalledTimes(5)

    await Promise.all([ page1, page2 ])

    expect(watch).toBeCalledTimes(6)

    users.update([1, 7])

    expect(watch).toBeCalledTimes(8)

    await Promise.all([ page1, page2 ])

    expect(watch).toBeCalledTimes(10)
  })
})
