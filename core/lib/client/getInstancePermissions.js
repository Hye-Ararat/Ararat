export default function getInstancePermissions(tokenData, instance) {
    return instance.users.filter(user => user.user.id == tokenData.id)[0].permissions.map(permission => permission.permission);
}