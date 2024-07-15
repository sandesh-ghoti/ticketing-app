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
    jetstreamManager: jest.fn().mockResolvedValue({
      consumers: {
        add: jest.fn().mockResolvedValue({}),
        list: jest.fn().mockReturnValue({
          next: jest.fn().mockResolvedValue([]),
        }),
      },
      streams: {
        list: jest
          .fn()
          .mockResolvedValue({ next: jest.fn().mockResolvedValue([]) }),
        add: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
      },
    }),
  } as unknown as NatsConnection,
};
