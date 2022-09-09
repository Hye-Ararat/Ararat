export default class InstanceUser {
    constructor(instance, user, instanceUserId) {
        this.instance = instance;
        this.user = user;
        this.instanceUserId = instanceUserId
    }
    get editWidgetLayout() {
        return new Promise(async (resolve, reject) => {
            let instanceData = await this.instance.data;
            let instanceUserObj = instanceData.users.find((user) => user.id == this.instanceUserId);
            if (instanceUserObj.userId == this.user.user) {
                return resolve(true);
            } else {
                return resolve(false);
            }
        })
    }
}