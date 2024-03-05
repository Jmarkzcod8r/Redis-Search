import { Client, Entity, Schema, Repository } from 'redis-om';

import fs from 'fs';
import { promisify } from 'util';
// import Redis from 'ioredis';

const readFileAsync = promisify(fs.readFile);

const client = new Client();

async function connect() {
    if (!client.isOpen()) {
        await client.open(process.env.REDIS_URL);
    }
}

class Car extends Entity {}
let schema = new Schema(
  Car,
  {
    make: { type: 'string' },
    model: { type: 'string' },
    image: { type: 'string' },
    description: { type: 'string', textSearch: true  },
  },
  {
    dataStructure: 'JSON',
  }
);

export async function createCar(data) {
  // try {
    // Read the JSON file
    const jsonData = await readFileAsync('./mock-data/cars.json', 'utf8');
    // Parse JSON data
    const carsData = JSON.parse(jsonData);
    console.log('carsData json', carsData)
  //  }
    // catch {
    //   console.log('error')
    // }

  await connect();

  const repository = new Repository(schema, client);


  const car = repository.createEntity(data);

  const id = await repository.save(car);

  const car2 = repository.createEntity(carsData);

  const id2 = await repository.save(car2);
  return id;
}

export async function getCar(id) {
  await connect();

  const repository = new Repository(schema, client);
  return repository.fetch(id);
}

export async function createIndex() {
    await connect();

    const repository = new Repository(schema, client);
    // const repository = client.fetchRepository(schema);
    await repository.createIndex()
}


export async function searchCars(q) {
    await connect();

  console.log('connecting for search') ;
    // const repository = new Repository(schema, client);
  // I think the problem lies in here..


    const repository = client.fetchRepository(schema);
    try {
      await repository.createIndex()
    } catch {
      console.log('index already exists')
    }
  //   const thisperson = await repository.fetch(schema)
  // console.log('thisperson', thisperson.entityData)

  //   console.log('repo', repository)
    const cars = await repository.search()
        .where('make').eq(q)
        .or('model').eq(q)
          // matches is the only one that  works with text fields
        .or('description').matches(q)
        .return.all();
  console.log('cars result',cars)

    return cars;
}