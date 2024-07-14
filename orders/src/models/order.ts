import mongoose from "mongoose";
import { TicketsDoc } from "./ticket";
import { OrderStatus } from "tickets-commonutils";
// Define the Order schema
//interface describes props required to create a Order
interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketsDoc;
}

//interface describes props that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: IOrder): OrderDoc;
}

//interface describes props that a Order Document has
export interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketsDoc;
  version: number;
}
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus), //to be sure that status is one of the values listed inside that enum
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.set("versionKey", "version");
orderSchema.pre("save", function (next) {
  this.increment();
  next();
});
orderSchema.statics.build = (attrs: IOrder) => {
  return new Order(attrs); //standard method + .save()
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
