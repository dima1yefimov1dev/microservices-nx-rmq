# Purple

## Feautures: 
- [X] NX for generating monorepos
- [X] Typescript
- [X] RabbitMQ for connection between microservices
- [X] NestJs
- [X] MongoDb
- [X] Docker

## How to start:
1. Install dependencies
  `npm ci`
2.create folder env with .env file and put variables there:
```
  MONGODB_URL=''
  JWT_SECRET=''
  AMQP_EXCHANGE=''
  AMQP_USER=''
  AMQP_PASSWORD=''
  AMQP_QUEUE=''
  AMQP_HOSTNAME=''
```
3.run docker in the root directory:
```
docker-compose up
```
4. Start server:
```
nx run-many --target=serve --all --parallel=10
```

5. if u want to run seperate microservice, type in terminal :
```
nx run MICROSERVICE_NAME:serve
```
