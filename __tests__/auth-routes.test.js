'use strict';
process.env.SECRET = 'killedme';
const { server } = require('../src/server.js');
const superGoose = require('@code-fellows/supergoose');
const { it, expect } = require('@jest/globals');
const request = superGoose(server);

describe('Auth tests',()=>{

  const users = [{
    username:'hector',
    password:'123',
    role:'user'
  },{
    username:'mike',
    password:'1223',
    role:'editor'
  },{
    username:'gus',
    password:'1223',
    role:'admin'
  }];

  const tokens = new Map();


  users.forEach(user => {

    it('should sign up a user',async () => {

      const response = await request.post('/signup').send(user);
      expect(response.status).toBe(201);
      expect(response.body.user.username).toEqual(user.username);
      expect(response.body.user._id).toBeDefined();
      expect(response.body.token).toBeDefined();

      tokens.set(user.username,response.body.token);




    });
    it('should sign in a user',async () => {

        const response = await request.post('/signin').auth(user.username,user.password);
        expect(response.status).toBe(200);
        expect(response.body.user.username).toEqual(user.username);
        expect(response.body.user._id).toBeDefined();
        expect(response.body.token).toBeDefined();
  
 
   
  
  
      });
    it('should give access to  the /secret route',async ()=>{
        const response = await request.get('/secret').set('Authorization', 'Bearer ' + tokens.get(user.username))
        expect(response.status).toBe(200);


    })
    it('should give/deny access to  the /users route',async ()=>{
        const response = await request.get('/users').set('Authorization', 'Bearer ' + tokens.get(user.username))
        if(user.role === 'admin'){
        expect(response.status).toBe(200);
        expect(response.body[2]).toEqual('gus');

        }else{
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Access Denied');




        }


    })




  });



});
