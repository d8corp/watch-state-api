import Api from '.'
import 'isomorphic-fetch'

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
})
