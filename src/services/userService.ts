import { userRepo } from '../repositories/userRepo';

export const userService = {
    async getAllUsers() {
        return await userRepo.getAllUsers();
    },
    async findUsers(searchParams) {
        return await userRepo.findUsers(searchParams);
    },
    async login(email, password) {
        const filterObject = { email: email }
        let user = await userRepo.updateExpDate(filterObject, 86400);
        if (!user) {
            return null;
        } else {
            await user.validPassword(password);
            return user.toAuthJSON();
        }
    },
    async setExpirationDate(id) {
        const filterObject = { _id: id }
        const lifeTime = 0
        return await userRepo.updateExpDate(filterObject, lifeTime);
    },
    async checkExpTime(id) {
        const user = await userRepo.getSingleUser(id);
        // let userExpTime = user.expirationDate.getSeconds();
        let today = new Date();
        console.log('today',today);
        console.log("user.expirationDate", user.expirationDate);
        return user.expirationDate > today ? true : false
    }
}