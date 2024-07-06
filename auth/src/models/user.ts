import mongoose from "mongoose";
import { Password } from "../utils/passwordEncryption";

// Define the user schema
//interface describes props required to create a user
interface IUser {
  name: string;
  email: string;
  password: string;
}

//interface describes props that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: IUser): UserDoc;
}

//interface describes props that a User Document has
interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
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
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (!this.isModified("password")) return done();

  const hashed = await Password.toHash(this.get("password"));
  this.set("password", hashed);
  done();
});

userSchema.statics.build = (attrs: IUser) => {
  return new User(attrs); //standard method + .save()
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
