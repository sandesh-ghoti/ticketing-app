import mongoose from "mongoose";
import { OrderStatus } from "tickets-commonutils";
// Define the Order schema
//interface describes props required to create a Order
interface IOrder {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

//interface describes props that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: IOrder): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

//interface describes props that a Order Document has
export interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};
orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
