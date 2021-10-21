import User from '../models/user';

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
        let filterQuery = [];
        filterQuery.push({ email: { $regex: key || "", $options: 'i' } });
        console.log(filterQuery);
        var query = User.find(filterQuery)
            .select('email')
            .sort(sortOrder)
        return await query.exec();
    },
    async updateExpDate(filterObject, expSeconds) {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + Number(expSeconds / 3600 / 24));
        console.log('expirationDate',expirationDate);
        console.log('filterObject',filterObject);
        return await User.findOneAndUpdate(filterObject, { expirationDate: expirationDate });
    }
}