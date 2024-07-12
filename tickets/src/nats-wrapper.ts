import {
  connect,
  JetStreamClient,
  JetStreamManager,
  NatsConnection,
  RetentionPolicy,
} from "nats";

class NatsWrapper {
  private _nc?: NatsConnection;
  get nc(): NatsConnection {
    if (!this._nc) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._nc;
  }
  get js(): JetStreamClient {
    return this.nc.jetstream();
  }
  get jsm(): Promise<JetStreamManager> {
    return this.js.jetstreamManager();
  }
  async connect(
    streamName: string,
    subjects: string[],
    url: string
  ): Promise<void> {
    this._nc = await connect({ servers: url });
    const jsm = await this.jsm;
    const streams = await jsm.streams.list().next();
    if (streams.length > 0) {
      const stream = streams.find((s) => s.config.name === streamName);
      if (stream) {
        console.log(
          `Stream ${streamName} already exists, so updating subjects`
        );
        const preSubjects = stream.config.subjects;
        let flag = false;
        for (const subject of subjects) {
          if (!preSubjects.includes(subject)) {
            subjects.push(subject);
            flag = true;
          }
        }
        if (!flag) {
          console.log(`No new subjects to add`);
          return;
        }
        stream.config.subjects = [
          ...new Set(...stream.config.subjects, ...subjects),
        ];
        await jsm.streams.update(streamName, stream.config);
        return;
      }
    }
    console.log(`Creating new stream ${streamName}`);
    await jsm.streams.add({
      name: streamName,
      retention: RetentionPolicy.Interest,
      subjects,
    });
  }
}

export const natsWrapper = new NatsWrapper();
