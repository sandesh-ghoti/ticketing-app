import { NatsConnection, JsMsg } from "nats";
export const natsWrapper = {
  connect: jest.fn().mockImplementation((): Promise<void> => {
    return Promise.resolve();
  }),
  nc: {
    jetstream: jest.fn().mockReturnValue({
      consumers: {
        get: jest.fn().mockResolvedValue({
          consume: jest.fn().mockResolvedValue(
            (async function* () {
              yield {
                json: jest.fn().mockReturnValue({
                  id: "123",
                  title: "Concert",
                  price: 100,
                  userId: "user-123",
                  version: 1,
                }),
                ack: jest.fn(),
              } as unknown as JsMsg;
            })()
          ),
        }),
      },
      publish: jest.fn().mockResolvedValue({ seq: 1 }),
    }),
    JetStreamManager: jest.fn().mockImplementation(() => ({
      consumers: {
        add: jest.fn().mockResolvedValue({}),
      },
      streams: {
        list: jest
          .fn()
          .mockResolvedValue({ next: jest.fn().mockResolvedValue([]) }),
        add: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
      },
    })),
  } as unknown as NatsConnection,
};
/** 
describe("Publisher", () => {

  it("should publish a ticket created event", async () => {
    const ticketCreatedPublisher = new TicketCreatedPublisher(nc);

    const data: TicketCreatedEvent["data"] = {
      id: "123",
      title: "Concert",
      price: 100,
      userId: "user-123",
      version: 1,
    };

    await ticketCreatedPublisher.publish(data);

    expect(natsWrapper.nc.jetstream().publish).toHaveBeenCalledWith(
      Subjects.TICKET_CREATED,
      JSON.stringify(data)
    );
  });

  it("should log message sequence and subject on successful publish", async () => {
    console.log = jest.fn();

    const ticketCreatedPublisher = new TicketCreatedPublisher(nc);

    const data: TicketCreatedEvent["data"] = {
      id: "123",
      title: "Concert",
      price: 100,
      userId: "user-123",
      version: 1,
    };

    await ticketCreatedPublisher.publish(data);

    expect(console.log).toHaveBeenCalledWith(
      `Message seq:1 Published with the subject:`,
      Subjects.TICKET_CREATED
    );
  });

  it("should reject the promise on publish error", async () => {
    natsWrapper.nc.jetstream().publish = jest.fn().mockRejectedValue(new Error("Publish error"));

    const ticketCreatedPublisher = new TicketCreatedPublisher(nc);

    const data: TicketCreatedEvent["data"] = {
      id: "123",
      title: "Concert",
      price: 100,
      userId: "user-123",
      version: 1,
    };

    await expect(ticketCreatedPublisher.publish(data)).rejects.toThrow(
      "Publish error"
    );
  });
});
*/
