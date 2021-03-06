const request = require('supertest')
const expect = require('expect')
const { ObjectId } = require('mongodb')

const app = require('../app')
const User = require('../models/users')

describe('/users', () => {

  // users list
  const users = [{
    _id: new ObjectId(),
    email: 'user0@test.net',
    password: 'asdfASDF1234!@#$',
    isAdmin: true
  }, {
    _id: new ObjectId(),
    email: 'user1@test.net',
    password: 'asdfASDF1234!@#$',
    isAdmin: false
  }]

  beforeEach(async () => {

    // delete all users
    await User.deleteMany()

    // save users
    await new User(users[0]).save()
    await new User(users[1]).save()

    return users
  })

  // GET /users/login
  describe('GET /users/login', () => {
    
    it('should respond 302, and redirect to /users/me, if user is already logged in', async () => {})
    it('should respond 200', async () => {})
  })

  // POST /users/login
  describe('POST /users/login', () => {
    
    it('should respond 401, and NOT create token if email is not in the DB', async () => {

      const user = { email: 'bob@aol.com', password: 'asdfASDF1234!@#$' }

      await request(app)
        .post('/users/login')
        .send(user)
        .expect(401)
        .expect(res => {
          expect(res.header['set-cookie']).toBeFalsy()
        })
    })

    it('should respond 401, and NOT create token if password is not correct', async () => {

      const user = { email: users[0].email , password: '1234!@#$asdfASDF' }

      await request(app)
        .post('/users/login')
        .send(user)
        .expect(401)
        .expect(res => {
          expect(res.header['set-cookie']).toBeFalsy()
        })
    })

    it('should respond 302, create token, and redirect to /users/me', async () => {

      const { email, password } = users[0]

      await request(app)
        .post('/users/login')
        .send({ email, password })
        .expect(302)
        .expect((res) => {
          expect(res.header.location).toEqual('/users/me')
          expect(res.header['set-cookie']).toBeTruthy()
        })
    })
  })

  // GET /users/logout
  describe('GET /users/logout', () => {
    
    it('should logout user, delete auth token, and redirect to /', async () => {})
  })

  // GET /users/signup
  describe('GET /users/signup', () => {
    
    it('should respond 400, if user is logged in', async () => {})
    it('should respond 200', async () => {})
  })

  // POST /users
  describe('POST /users', () => {
    
    it('should respond 400, and NOT create user, if email is invalid', async () => {

      const user = { email: 'asdf', password: 'asdfASDF1234!@#$' }

      await request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.header['set-cookie']).toBeFalsy()
        })
    })

    it('should respond 400, and NOT create user, if password is invalid', async () => {

      const user = { email: 'user2@test.net', password: 'pass' }

      await request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.header['set-cookie']).toBeFalsy()
        })
    })

    it('should respond 400, and NOT create user, if user already exists', async () => {
      
      const user = { email: 'user0@test.net', password: 'asdfASDF1234!@#$' }

      await request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.header['set-cookie']).toBeFalsy()
        })
    })
    
    it(`should respond 302, hash password, create a new user,
      token and cookie, then redirect to /users/me`, async () => {

      const user = { email: 'user2@test.net', password: 'asdfASDF1234!@#$' }

      await request(app)
        .post('/users')
        .send(user)
        .expect(302)
        .expect(res => {
          expect(res.header.location).toEqual('/users/me')
          expect(res.header['set-cookie']).toBeTruthy()
        })

      const foundUser = await User.findOne({ email: user.email })
      expect(foundUser).toBeTruthy()
      expect(foundUser.email).toEqual(user.email)
      expect(foundUser.password).not.toEqual(user.password)
    })
  })

  // GET /users
  describe('GET /users/me', () => {
    
    it('should respond 401 if user is not logged in', async () => {})
    it('should respond 400 if token is invalid', async () => {})
    it('should respond 200 if user is logged in', async () => {})
  })

  // GET /users/me/edit
  describe('GET /users/me/edit', () => {
    
    it('should respond 401 if user is NOT logged in', async () => {})
    it('should respond 200 if user is logged in', async () => {})
  })

  // PATCH /users/me
  describe('PATCH /users/me', () => {
    
    it('should respond 401, and NOT update user, if user is NOT logged in', async () => {})
    it('should respond 400, and NOT update user, if email is invalid', async () => {})
    it('should respond 400, and NOT update user, if password is invalid', async () => {})
    it('should respond 400, and NOT update user, if new email already exists in the DB', async () => {})
    it('should respond 302, update user, and redirect to /users/me', async () => {})
  })

  // DELETE /users/me
  describe('DELETE /users/me', () => {
    
    it('should respond 401 if user is NOT logged in', async () => {})
    it('should respond 302, delete the user, cookie, and workouts, then redirect to /', async () => {})
  })

  // GET /users/login
  describe('GET /users/login', () => {

    it('should respond 401 if email is NOT in the DB', async () => {})
    it('should respond 401 if password is NOT correct', async () => {})
    // it('should respond 302, create token and cookie, and redirect to /users/me', async () => {})
  })

  // GET /users/logout
  describe('GET /users/logout', () => {

    it('should respond 302, delete cookie, and redirect to /', async () => {})
  })
})
