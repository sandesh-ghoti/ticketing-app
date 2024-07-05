import mongoose from "mongoose";

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
const userSchema = new mongoose.Schema({
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
});

userSchema.statics.build = (attrs: IUser) => {
  return new User(attrs); //standard method + .save()
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
