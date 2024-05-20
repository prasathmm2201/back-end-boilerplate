import amqp, { Connection, Channel } from "amqplib";
import { config } from "../configs";
import { sendMail } from "../services";

interface RabbitMQOptions {
  queue: string;
}

interface RabbitMQConnection {
  connection: Connection;
  channel: Channel;
}

export class MQService {
  private readonly externalQueue: Promise<RabbitMQConnection>;

  constructor() {
    this.externalQueue = this.connectToRabbitMQ();
  }

  public async connectToRabbitMQ(): Promise<RabbitMQConnection> {
    try {
      const connection = await amqp.connect(config.rabbit_mq);
      const channel = await connection.createChannel();
      await channel.assertQueue("email");

      return { connection, channel };
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }

  public async consumeMessage(
    options: RabbitMQOptions,
    message: any
  ): Promise<void> {
    const { channel } = await this.externalQueue;
    try {
      const { queue: existingQueue } = await channel.checkQueue(options.queue);
      if(!existingQueue){
        channel.assertQueue(options.queue, { durable: false });
      }
      channel.sendToQueue(options.queue, Buffer.from(JSON.stringify(message)));
      console.log(`Message sent to RabbitMQ queue "${options.queue}"`);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async InitiateRabbitMQ(queues: string[]) {
    const { channel } = await this.externalQueue;
    try {
      {
        queues.forEach(async (queue) => {
          console.log(`Waiting for ${queue ?? ""} messages..`);
          channel.consume(queue, (msg) => {
            if (msg !== null) {
              if (queue === "email") {
                const { to, data , email_type , subject} = JSON.parse(
                  msg.content.toString()
                );
                sendMail({
                  to, data , email_type , subject
                })
              }
            }

            channel.ack(msg);
          });
        });
      }
    } catch (error) {
      console.error("Error receiving email messages:", error);
    }
  }

  async closeConnection() {
    const { connection } = await this.externalQueue;
    if (connection) {
      connection.close();
      console.log("RabbitMQ connection closed.");
    }
  }
}


export const RabbitMQ = () => {
  const mq = connectingRabbitMQ(["email"])

  async function connectingRabbitMQ(queues = []) {
    try {
      const connection = await amqp.connect(config.rabbit_mq);
      const channel = await connection.createChannel();
      for (const queue of queues) {
        await channel.assertQueue(queue, { durable: false });
      }
      return { channel };
    } catch (err) {
      console.log(err, 'Error connecting to RabbitMQ');
      throw err;
    }
  }
  async function initiateMQ(queues: string[]) {
    try {
      const { channel } = await mq;
      for (const queue of queues) {
        console.log(`Waiting for ${queue ?? ""} messages..`);
        channel.consume(queue, (msg) => {
          if (msg !== null) {
            if (queue === "email") {
              console.log('Email Queue called');
            }
          }
        });
      }
    } catch (err) {
      console.error('Error initiating RabbitMQ:', err);
      throw err;
    }
  }
  async function consumeMessage({
    queue,
    message,
  }: {
    queue: string;
    message: object;
  }) {
    const { channel } = await mq;

    try {
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      console.log(`Message sent to RabbitMQ queue "${queue}"`);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
  async function closeConnection() {
    const { channel } = await mq;

    if (channel) {
      channel.close();
      console.log("RabbitMQ connection closed.");
    }
  }

  return {
    initiateMQ,
    closeConnection,
    consumeMessage
  }

}