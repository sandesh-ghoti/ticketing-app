import { JetStreamClient } from "nats";
import { Event } from "./shared";

/**
 * Abstract class for publishers of NATS events.
 *
 * This class provides a base implementation for publishing events
 * to NATS. It handles publishing messages to the specified subject
 * using the JetStream client.
 *
 * @template T The type of event to publish.
 */
export abstract class Publisher<T extends Event> {
  /**
   * The subject of the event to publish to.
   */
  abstract subject: T["subject"];

  /**
   * The JetStream client.
   */
  private js: JetStreamClient;

  /**
   * Constructor for the Publisher class.
   *
   * @param js The JetStream client.
   */
  constructor(js: JetStreamClient) {
    this.js = js;
  }

  /**
   * Publishes an event to the specified subject.
   *
   * This method serializes the event data to JSON and publishes
   * it to the JetStream using the JetStream client.
   *
   * @param data The data of the event to publish.
   * @returns A promise that resolves when the event is published.
   */
  publish(data: T["data"]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const msg = await this.js.publish(this.subject, JSON.stringify(data));
        console.log("Published", this.subject);
        resolve();
      } catch (error) {
        return reject(error);
      }
    });
  }
}
