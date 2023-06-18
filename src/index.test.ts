import 'isomorphic-fetch'
import './BroadcastChannel'

import Api from './Api'
import { type ApiData } from './types'

interface User { data: { id: string } }
interface UserData extends ApiData { user: number }

describe('Api', () => {
  test('test', async () => {
    const user = new Api<User, unknown, UserData>('https://reqres.in/api/users/{user}')

    const user1 = user.get({ user: 1 })

    await user1

    expect(user1.value.data.id).toBe(1)
  })
})
