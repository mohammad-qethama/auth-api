'use strict';

const { server } = require('../src/server.js');
const superGoose = require('@code-fellows/supergoose');
const { it, expect } = require('@jest/globals');
const request = superGoose(server);


describe('api server', () => {
    let idFood;
    let idClothes;
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
        const responseFood = await request.post('/api/v1/food').send(food);
        const responseClothes = await request.post('/api/v1/clothes').send(shirt);
        //assert
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

        idFood = responseFood.body._id;
        idClothes = responseClothes.body._id;
        // console.log({idFood});
    });

      
    it('should read the food/clothes list',async ()=>{

        const responseFood = await request.get('/api/v1/food');
        const responseClothes = await request.get('/api/v1/clothes');
        
        
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

        const responseFood = await request.get(`/api/v1/food/${idFood}`);
        const responseClothes = await request.get(`/api/v1/clothes/${idClothes}`);
        
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
        const responseFood = await request.put(`/api/v1/food/${idFood}`).send(editFood);
        const responseClothes = await request.put(`/api/v1/clothes/${idClothes}`).send(editShirt);
                   
        //asert
        
        expect(responseFood.status).toEqual(200);
        expect(responseClothes.status).toEqual(200);

        expect(responseFood.body.name).toEqual('cucumber');
        expect(responseFood.body.type).toEqual('VEGETABLE');
        expect(responseFood.body.calories).toEqual(20);

        expect(responseClothes.body.size).toEqual('large');
        expect(responseClothes.body.color).toEqual('grey');
        expect(responseClothes.body.name).toEqual('pants');

    });

    it('should delete the clothes/food item(s)',async()=>{

        let responseFood  = await request.delete(`/api/v1/food/${idFood}`) ;
        let responseClothes  = await request.delete(`/api/v1/clothes/${idClothes}`) ;

        expect(responseFood.status).toEqual(200);
        expect(responseClothes.status).toEqual(200);

        responseFood = await request.get(`/api/v1/food/${idFood}`);
        responseClothes = await request.get(`/api/v1/clothes/${idClothes}`);
        expect(responseFood.body).toBeFalsy();
        expect(responseFood.clothes).toBeFalsy();





        // expect(responseFood.status).toEqual(200);
        // expect(responseClothes.status).toEqual(200);

        // expect(responseFood.body.length).toEqual(0);
        // expect(responseClothes.body.length).toEqual(0);
        
        

    })
        it('should be notFound error',async ()=>{
        const res = await request.patch('/api/v1/food');
        expect(res.status).toEqual(404);
      
        });

    it('should be notFound error',async ()=>{
        const res = await request.get('/sad');
        expect(res.status).toEqual(404);
      
      });
});



    

