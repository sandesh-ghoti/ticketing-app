import mongoose from "mongoose";

// Define the Ticket schema
//interface describes props required to create a Ticket
interface ITickets {}

//interface describes props that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketsDoc> {
  build(attrs: ITickets): TicketsDoc;
}

//interface describes props that a Ticket Document has
interface TicketsDoc extends mongoose.Document {}
const ticketsSchema = new mongoose.Schema(
  {},
  {
    //manipulate the JSON representation
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketsSchema.statics.build = (attrs: ITickets) => {
  return new Ticket(attrs); //standard method + .save()
};

const Ticket = mongoose.model<TicketsDoc, TicketModel>("Ticket", ticketsSchema);

export { Ticket };
