import {
  AckPolicy,
  Consumer,
  DeliverPolicy,
  JsMsg,
  NatsConnection,
} from "nats";
import { Event } from "./shared";

/**
 * Abstract class for subscribers to NATS events.
 *
 * This class provides a base implementation for subscribing to events
 * published on NATS. It handles setting up a JetStream consumer and
 * consuming messages from the stream.
 *
 * @template T The type of event to subscribe to.
 */
export abstract class Subscriber<T extends Event> {
  /**
   * The subject of the event to subscribe to.
   */
  abstract subject: T["subject"];

  /**
   * The name of the consumer.
   */
  abstract consumerName: string;

  /**
   * The NATS connection.
   */
  private nc: NatsConnection;

  /**
   * The name of the stream to consume from.
   */
  abstract streamName: string;

  /**
   * The maximum time in nanoseconds to wait for an acknowledgement.
   */
  protected ackWait = 5 * 1000 * 1000 * 1000;

  /**
   * The maximum number of messages to consume before the consumer expires.
   */
  protected maxMessages = 10;

  /**
   * The maximum time in milliseconds before the consumer expires.
   */
  protected expires = 10 * 1000;
  private consumer!: Consumer;
  /**
   * Abstract method to handle incoming messages.
   *
   * @param data The data of the event.
   * @param msg The NATS message.
   */
  abstract onMessage(data: T["data"], msg: JsMsg): void;

  /**
   * Constructor for the Subscriber class.
   *
   * @param nc The NATS connection.
   */
  constructor(nc: NatsConnection) {
    this.nc = nc;
    this.setupConsumer().catch((err) => {
      console.error(`Error setting up consumer: ${err.message}`);
    });
  }

  /**
   * Sets up the JetStream consumer.
   *
   * This method create only if not exists the consumer with the specified
   * configuration else through an error if exists with different configuration.
   */
  private async setupConsumer() {
    const jsm = await this.nc.jetstreamManager();

    // Add or update the consumer
    const consumers = await jsm.consumers.list(this.streamName).next();
    if (consumers.length > 0) {
      for (const c of consumers) {
        if (c.config.durable_name === this.consumerName) {
          console.log(`Consumer ${this.consumerName} already exists`);
          const c = await this.nc
            .jetstream()
            .consumers.get(this.streamName, this.consumerName);
          this.consumer = c;
          return;
        }
      }
    }
    await jsm.consumers.add(this.streamName, {
      durable_name: this.consumerName,
      ack_policy: AckPolicy.Explicit,
      filter_subject: this.subject,
      ack_wait: this.ackWait,
      deliver_policy: DeliverPolicy.All,
    });
    const c = await this.nc
      .jetstream()
      .consumers.get(this.streamName, this.consumerName);
    this.consumer = c;
    return;
  }

  /**
   * Starts consuming messages from the stream.
   *
   * This method gets the consumer and starts consuming messages
   * with the specified configuration.
   */
  async consume() {
    // Get the consumer and start consuming messages
    if (!this.consumer) {
      await this.setupConsumer();
    }
    const iter = await this.consumer.consume({
      max_messages: this.maxMessages,
      expires: this.expires,
    });
    await (async () => {
      for await (const m of iter) {
        const data = this.parseMessage(m);
        this.onMessage(data, m);
      }
    })();
  }

  /**
   * Parses the message data.
   *
   * This method attempts to parse the message data as JSON. If
   * parsing fails, it returns the message data as a string.
   *
   * @param msg The NATS message.
   * @returns The parsed message data.
   */
  parseMessage(msg: JsMsg): T["data"] {
    try {
      return JSON.parse(msg.string());
    } catch (err: any) {
      console.error(`Error parsing message: ${err.message!}`);
      return msg.json();
    }
  }
}
