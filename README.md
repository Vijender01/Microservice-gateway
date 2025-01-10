<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).







---

---

# Project Setup

## Gateway Service

The gateway is built using [NestJS](https://nestjs.com/) and is running on **Node v20.18.1**. 

### Prerequisites

Before running the application, make sure the following services are up and running:

1. **MongoDB**: 
   - MongoDB should be running on the default port **27017**.
   - If you don't have MongoDB installed, you can download and install it from [here](https://www.mongodb.com/try/download/community).

2. **RabbitMQ**: 
   - A RabbitMQ connection is required.
   - Sign up for a free account at [RabbitMQ Cloud](https://www.cloudamqp.com/) or [RabbitMQ.com](https://www.rabbitmq.com/) to get access to your RabbitMQ URL.
   - Once you have the credentials, you will need to add them to your `.env` file.

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```
RABBIT_MQ_URL= "<Your RabbitMQ URL>"
JWT_SECRET= "<Your JWT Secret>"
EXPIRES_IN= "30d"
FRONTEND_URL= "http://localhost:4200"
MONGODB_URL= "mongodb://localhost:27017/nest_main"
```

### Installation

1. Install all dependencies by running:

   ```
   npm install
   ```

2. After all dependencies are installed, you can start the development server with:

   ```
   npm run start:dev
   ```

   Or to run in production mode, use:

   ```
   npm run start
   ```

### Microservices

This gateway service depends on other microservices such as the **User Service** and **Product Service**. To access these services, you must follow the same setup steps (i.e., environment variables, installation) for them as well.

Once those services are up and running, you will be able to hit the relevant routes in the gateway service controllers.

### Notes:

- Make sure all services (Gateway, User Service, Product Service) are connected to the same RabbitMQ and MongoDB instances.
- Verify that all microservices are running before making requests to the gateway.








----

## **Using `@MessagePattern` vs `@EventPattern`**

In a **NestJS microservice** architecture, communication between services can be achieved using either `@MessagePattern` or `@EventPattern`. Understanding when to use each pattern is crucial for designing a robust, scalable system.

### **1. `@MessagePattern`**

`@MessagePattern` is used for **request-response** communication, where the sender expects a response from the receiver before proceeding with further operations. It is suitable for tightly coupled services where synchronous acknowledgment or error handling is required.

#### **When to Use `@MessagePattern`**

- **Request-Response Communication**:  
  When the sender needs a confirmation or result before proceeding.
  
- **Error Handling**:  
  Ensures that errors on the receiver side can be handled by the sender (e.g., triggering compensating actions or retries).

- **Synchronous Workflows**:  
  If operations depend on each other, and one service must wait for another to complete before continuing.

#### **Example**

```typescript
// Sender: Product Service
const response = await this.userClient.send('purchase_history', payload).toPromise();

// Receiver: User Service
@MessagePattern('purchase_history')
public async handlePurchaseHistory(data: IUserPurchaseHistory): Promise<{ status: number; message: string }> {
  // Handle request and send response
}
```

---

### **2. `@EventPattern`**

`@EventPattern` is used for **fire-and-forget** communication, where the sender emits an event and doesn’t wait for a response. It’s ideal for decoupling services and broadcasting events to multiple receivers.

#### **When to Use `@EventPattern`**

- **Fire-and-Forget Communication**:  
  When the sender doesn’t need to know the outcome immediately.

- **Decoupled Services**:  
  Useful for decoupling microservices, as the sender only emits an event, and receivers can handle it independently.

- **Broadcasting Events**:  
  If the same event needs to be consumed by multiple services (e.g., logging, notifications, analytics).

- **Asynchronous Workflows**:  
  When operations can be processed independently and asynchronously by different services.

#### **Example**

```typescript
// Sender: Product Service
this.userClient.emit('purchase_history', payload);

// Receiver: User Service
@EventPattern('purchase_history')
public async handlePurchaseHistoryEvent(data: { purchase: IUserPurchaseHistory }) {
  // Handle the event asynchronously
}
```

---

### **Summary**

| Feature                      | `@MessagePattern`                     | `@EventPattern`                         |
|------------------------------|---------------------------------------|----------------------------------------|
| **Communication Type**       | Request-Response                      | Fire-and-Forget                        |
| **Use Case**                 | Tightly coupled, synchronous workflows | Decoupled, asynchronous workflows      |
| **Error Handling**           | Immediate acknowledgment and handling | Requires custom retry mechanisms       |
| **Workflow**                 | Synchronous                           | Asynchronous                           |
| **Multiple Receivers**       | Not ideal                             | Ideal (broadcasting events)            |

---

