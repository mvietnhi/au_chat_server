import User from '../models/user';
import Conversation from '../models/conversation';

export const userRepo = {

    async getAllUsers() {
        return await User.find();
    },
    async getSingleUser(id) {
        return await User.findById(id);
    },
    async findUsers(searchParams) {
        const { key } = searchParams;
        let sortOrder = {};
        // Search like { email: { $regex: key || "", $options: 'i' } }
        var query = User.find().or([{ email: key }, { name: key }])
            // .select(['email', 'name'])
            .sort(sortOrder)
        return await query.exec();
    },
    async findFriends(id) {
        let friends = await User.find({ friendIds: id })
        return friends;
    },
    async updateExpDate(filterObject, expSeconds) {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + Number(expSeconds / 3600 / 24));
        console.log('expirationDate', expirationDate);
        console.log('filterObject', filterObject);
        return await User.findOneAndUpdate(filterObject, { expirationDate: expirationDate });
    }
}