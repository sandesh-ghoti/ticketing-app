import mongoose from "mongoose";
// Define the Payment schema
//interface describes props required to create a Payment
interface IPayment {
  orderId: string;
  stripeId: string;
}

//interface describes props that a Payment Model has
interface PaymentModel extends mongoose.Model<PaymentsDoc> {
  build(attrs: IPayment): PaymentsDoc;
}

//interface describes props that a Payment Document has
export interface PaymentsDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

paymentSchema.set("versionKey", "version");
paymentSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.increment();
    next();
  }
});
paymentSchema.statics.build = (attrs: IPayment) => {
  return new Payment(attrs); //standard method + .save()
};

const Payment = mongoose.model<PaymentsDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
