export default function getLXDUserPermissions(user, json) {
    let permissions = [];
    Object.keys(json).forEach(key => {
        if (key == user) {
            json[key].forEach(permission => {
                permissions.push(permission);
            })
        }
    })
    return permissions;
}