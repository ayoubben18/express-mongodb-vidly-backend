const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');


describe('/api/genres', ()=>{
    let server;

    beforeEach(()=>{
        server = require('../../index');
    })
    afterEach(async ()=>{
        await server.close();
        await Genre.deleteMany();
    })

    describe('GET /',()=>{
        it("should return all genres", async ()=>{
            await Genre.collection.insertMany([
                {name:'genre1'},
                {name:'genre2'},
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g=> g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g=> g.name === 'genre2')).toBeTruthy();

            
        })
    })
    describe('GET /:id',()=>{
        it('should return a valid genre if valid id is passed',async ()=>{
            const genre = new Genre({name:'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/'+genre._id);

            expect(res.status).toBe(200);
            
            expect(res.body).toHaveProperty('name',genre.name);
           
        })
        it('should return 404 if invalid id is passed',async ()=>{
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);           
        })
    })
// define the happy path
let token;
let name;

const execute = async ()=>{
    return  await request(server)
    .post('/api/genres')
    .set('x-auth-token',token)
    .send({name:name});
}

beforeEach(()=>{
  token = new User().generateAuthToken();
  name = 'backend dev'
})

    describe('POST /',()=>{
        it('should return a 401 if client is not logged in',async()=>{
            token = '';
            const res = await execute();
            expect(res.status).toBe(401);
        });
        it('should return a 400 if genre is invalid genre less than 5 ch',async()=>{
            name = '1234';
            const res = await execute();
            expect(res.status).toBe(400);
        });
        it('should return a 400 if genre is invalid genre more than 50 ch',async()=>{
            name = new Array(52).join('a');
            const res = await execute();
            expect(res.status).toBe(400);
        });
        it('should save the genre if it is valid',async()=>{
            await execute();
            const genre = await Genre.find({name:'backend dev'})
            expect(genre).not.toBeNull();
        });
        it('should return the genre if it is valid',async()=>{
            const res = await execute();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name','backend dev');
        });
    })
})