import { JetStreamClient, NatsConnection, RetentionPolicy } from "nats";

/**
 * Enum of all subjects used in the ticketing system.
 */
export enum Subjects {
  TICKET_CREATED = "ticket.created",
  ORDER_CREATED = "order.created",
  PAYMENT_CREATED = "payment.created",
}

/**
 * Interface for all events in the ticketing system.
 */
export interface Event {
  subject: Subjects;
  data: any;
}

/**
 * Name of the stream used for ticketing events.
 */
export const STREAM_NAME = "Ticketing";

/**
 * Creates or updates the ticketing stream with the specified subjects.
 *
 * @param nc The NATS connection.
 * @returns The JetStream client.
 */
export async function createOrUpdateTicketingStream(
  nc: NatsConnection
): Promise<JetStreamClient> {
  const js = nc.jetstream();
  const jsm = await nc.jetstreamManager();

  // check for old stream and updated
  const streams = await jsm.streams.list().next();
  if (streams.length > 0) {
    const stream = streams.find((s) => s.config.name === STREAM_NAME);
    if (stream) {
      stream.config.subjects = Object.values(Subjects);
      await jsm.streams.update(STREAM_NAME, stream.config);
      return js;
    }
  }
  // create new stream
  await jsm.streams.add({
    name: STREAM_NAME,
    retention: RetentionPolicy.Interest,
    subjects: Object.values(Subjects),
  });
  return js;
}
