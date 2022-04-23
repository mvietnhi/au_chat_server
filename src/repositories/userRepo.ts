import User from "../models/user";
import Conversation from "../models/conversation";
import { UpdateProfile } from "../dto/updateProfile";

export const userRepo = {
  async getAllUsers() {
    return await User.find();
  },

  async getSingleUser(id: String) {
    return await User.findById(id);
  },

  async findUsers(searchParams: any) {
    const { key } = searchParams;
    let sortOrder = {};
    // Search like { email: { $regex: key || "", $options: 'i' } }
    var query = User.find()
      .or([{ email: key }, { name: key }])
      // .select(['email', 'name'])
      .sort(sortOrder);
    return await query.exec();
  },

  async findFriends(id: String) {
    let friends = await User.find({ friendIds: id });
    return friends;
  },

  async updateProfile(id: String, updateData: UpdateProfile) {
    const friends = await User.findByIdAndUpdate(id, {
      $set: {
        name: updateData.name,
      },
    });
    return friends;
  },

  async updateExpDate(filterObject: any, expSeconds: number) {
    const expirationDate = new Date();
    expirationDate.setDate(
      expirationDate.getDate() + Number(expSeconds / 3600 / 24)
    );

    return await User.findOneAndUpdate(filterObject, {
      expirationDate: expirationDate,
    });
  },
};
