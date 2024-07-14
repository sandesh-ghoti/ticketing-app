import mongoose from "mongoose";
// Define the Ticket schema
//interface describes props required to create a Ticket
interface ITickets {
  title: string;
  userId: string;
  price: number;
}

//interface describes props that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketsDoc> {
  build(attrs: ITickets): TicketsDoc;
}

//interface describes props that a Ticket Document has
export interface TicketsDoc extends mongoose.Document {
  title: string;
  userId: string;
  price: number;
  version: number;
  orderId?: string;
}
const ticketsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    //manipulate the JSON representation
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketsSchema.set("versionKey", "version");
ticketsSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.increment();
    next();
  }
});
ticketsSchema.statics.build = (attrs: ITickets) => {
  return new Ticket(attrs); //standard method + .save()
};

const Ticket = mongoose.model<TicketsDoc, TicketModel>("Ticket", ticketsSchema);

export { Ticket };
