import mongoose from "mongoose";
import { OrderStatus } from "tickets-commonutils";
import { Order } from "./order";
// Define the Ticket schema
//interface describes props required to create a Ticket
interface ITickets {
  title: string;
  id: string;
  price: number;
}

//interface describes props that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketsDoc> {
  build(attrs: ITickets): TicketsDoc;
}

//interface describes props that a Ticket Document has
export interface TicketsDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  orderId?: string;
  isReserved(): Promise<boolean>;
}
const ticketsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
      min: 0,
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

ticketsSchema.statics.build = (attrs: ITickets) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  }); //standard method + .save()
};
ticketsSchema.methods.isReserved = async function () {
  const existingTicket = await Order.findOne({
    ticket: this,
    status: {
      $ne: OrderStatus.Cancelled,
    },
  });
  return !!existingTicket; //'!!' to prevent case null (!null =>true)
};
const Ticket = mongoose.model<TicketsDoc, TicketModel>("Ticket", ticketsSchema);

export { Ticket };
