'use strict';
process.env.SECRET = 'killedme';
const { server } = require('../src/server.js');
const superGoose = require('@code-fellows/supergoose');
const { it, expect } = require('@jest/globals');
const request = superGoose(server);

describe('Auth tests',()=>{

  const users = [
    {
        username:'mike',
        password:'1223',
        role:'editor'
      },{
    username:'hector',
    password:'123',
    role:'user'
  },{
    username:'gus',
    password:'1223',
    role:'admin'
  }];

  let idFood;
  let idClothes;

  const tokens = {};


  users.forEach(user => {

    it('should sign up a user',async () => {

      const response = await request.post('/signup').send(user);
      expect(response.status).toBe(201);
      expect(response.body.user.username).toEqual(user.username);
      expect(response.body.user._id).toBeDefined();
      expect(response.body.token).toBeDefined();

      tokens[user.username]=response.body.token;

    

   });

   it('should create a new food/clothes using post request', async () => {
    //arrange
    let food = {
        name: 'angus prime',
        calories:500,
        type: 'PROTIEN'
    }

    let shirt = {
        name:'shirt',
        color: 'black',
        size:'medium'
       }
    //act
    const responseFood = await request.post('/api/v1/food').send(food).set('Authorization', 'Bearer ' + tokens[user.username]);
    const responseClothes = await request.post('/api/v1/clothes').send(shirt).set('Authorization', 'Bearer ' + tokens[user.username]);
    //assert

    if ((user.role === 'admin') || (user.role === 'editor') ){
    expect(responseFood.status).toEqual(201);
    expect(responseFood.body.name).toEqual('angus prime');
    expect(responseFood.body.type).toEqual('PROTIEN');
    expect(responseFood.body.calories).toEqual(500);


    expect(responseFood.body._id.length).toBeGreaterThan(0);

    expect(responseClothes.status).toEqual(201);
    expect(responseClothes.body.size).toEqual('medium');
    expect(responseClothes.body.color).toEqual('black');
    expect(responseClothes.body.name).toEqual('shirt');
    expect(responseClothes.body._id.length).toBeGreaterThan(0);
   }else{
    expect(responseClothes.status).toEqual(500);
    console.log(responseClothes.body.error);

   }



    idFood = responseFood.body._id;
    idClothes = responseClothes.body._id;
    // console.log({idFood});
    });

  
    it('should read the food/clothes list',async ()=>{

    const responseFood = await request.get('/api/v1/food').set('Authorization', 'Bearer ' + tokens[user.username]);
    const responseClothes = await request.get('/api/v1/clothes').set('Authorization', 'Bearer ' + tokens[user.username]);
    
    
    expect(responseClothes.status).toEqual(200);
    expect(responseClothes.body.length).toBeGreaterThan(0);
    expect(responseClothes.body[0].size).toEqual('medium');
    expect(responseClothes.body[0].color).toEqual('black');
    expect(responseClothes.body[0].name).toEqual('shirt');

    
    expect(responseFood.status).toEqual(200);
    expect(responseFood.body.length).toBeGreaterThan(0);
    expect(responseFood.body[0].name).toEqual('angus prime');
    expect(responseFood.body[0].type).toEqual('PROTIEN');
    expect(responseFood.body[0].calories).toEqual(500);

    


    });

    it('should read the food/clothes item by id',async ()=>{

      const responseFood = await request.get(`/api/v1/food/${idFood}`).set('Authorization', 'Bearer ' + tokens[user.username]);
      const responseClothes = await request.get(`/api/v1/clothes/${idClothes}`).set('Authorization', 'Bearer ' + tokens[user.username]);
    
      expect(responseFood.status).toEqual(200);
      expect(responseClothes.status).toEqual(200);

      expect(responseFood.body.name).toEqual('angus prime');
      expect(responseFood.body.type).toEqual('PROTIEN');
      expect(responseFood.body.calories).toEqual(500);

      expect(responseClothes.body.size).toEqual('medium');
      expect(responseClothes.body.color).toEqual('black');
      expect(responseClothes.body.name).toEqual('shirt');




    });



    it('should update a clothes/food using put request', async () => {
    //arrange
    let editFood = {
        name: 'cucumber',
        calories:20,
        type: 'VEGETABLE'
    };

    let editShirt = {
        name:'pants',
        color: 'grey',
        size:'large'
    }
    //act
    const responseFood = await request.put(`/api/v1/food/${idFood}`).send(editFood).set('Authorization', 'Bearer ' + tokens[user.username]);
    const responseClothes = await request.put(`/api/v1/clothes/${idClothes}`).send(editShirt).set('Authorization', 'Bearer ' + tokens[user.username]);
               
    //asert
    if ((user.role === 'admin') || (user.role === 'editor') ){ 
    
    expect(responseFood.status).toEqual(200);
    expect(responseClothes.status).toEqual(200);

    expect(responseFood.body.name).toEqual('cucumber');
    expect(responseFood.body.type).toEqual('VEGETABLE');
    expect(responseFood.body.calories).toEqual(20);

    expect(responseClothes.body.size).toEqual('large');
    expect(responseClothes.body.color).toEqual('grey');
    expect(responseClothes.body.name).toEqual('pants');}else{
        expect(responseClothes.status).toEqual(500);
        console.log(responseClothes.body.error);

       }

    });

    // it('should delete the clothes/food item(s)',async()=>{
    // console.log(user.username);

    // let responseFood  = await request.delete(`/api/v1/food/${idFood}`).set('Authorization', 'Bearer ' + tokens[user.username]) ;
    // let responseClothes  = await request.delete(`/api/v1/clothes/${idClothes}`).set('Authorization', 'Bearer ' + tokens[user.username]) ;

    // if ((user.role === 'admin') ){ 
    // expect(responseFood.status).toEqual(200);
    // expect(responseClothes.status).toEqual(200);

    // responseFood = await request.get(`/api/v1/food/${idFood}`).set('Authorization', 'Bearer ' + tokens[user.username]);
    // responseClothes = await request.get(`/api/v1/clothes/${idClothes}`).set('Authorization', 'Bearer ' + tokens[user.username]);
    // expect(responseFood.body).toBeFalsy();
    // expect(responseFood.clothes).toBeFalsy();}else{
    //     console.log(user.username);
    //     expect(responseClothes.status).toEqual(500);
    //     console.log(responseClothes.body.error);

    //    }



    // })

    it('should be notFound error',async ()=>{
    const res = await request.patch('/api/v2/food');
    expect(res.status).toEqual(404);
  
    });

    it('should be notFound error',async ()=>{
    const res = await request.get('/sad');
    expect(res.status).toEqual(404);
  
    });
 
   });

});


