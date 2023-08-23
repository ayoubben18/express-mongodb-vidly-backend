const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');
const { Rental } = require('../../models/rental');
const moment = require('moment');
const { Movie } = require('../../models/movie');



describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let movie;
    let rental;
    let token;


    beforeEach(async () => {
        server = require('../../index');
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken()
        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: '12345',
            numberInStock: 10
        })


        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2

            }
        });
        await rental.save();
    })
    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    })
    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({
                customerId, movieId
            });
    };

    it('should work!', () => {
        const result = Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });
    it('should return 401 if client is not loggend in.', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return 400 if customerId is not provided.', async () => {
        customerId = null;

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 400 if movieId is not provided.', async () => {
        movieId = null;

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 404 if no rental found for the customer/movie.', async () => {
        await Rental.deleteMany({});
        const res = await exec();

        expect(res.status).toBe(404);
    });
    it('should return 400 if return is already processed.', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 200 if we have a valid requset.', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
    it('should set the return date if input is valid.', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const dif = new Date() - rentalInDb.dateReturned;
        expect(dif).toBeLessThan(10 * 1000);
    });
    it('should return the dailyRentalRate.', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        rental.movie.dailyRentalRate = 2
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14);
    });
    it('should increase the movie stock if input is valid.', async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movieId);

        expect(movieInDb.numberInStock).toEqual(movie.numberInStock + 1);
    });
    it('should return the rental if input is valid.', async () => {
        const res = await exec();


        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['movie', 'customer', 'rentalFee', 'dateReturned', 'dateOut'])
        );

    });
})