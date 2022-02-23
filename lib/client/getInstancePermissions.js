export default function getInstancePermissions(id, instance) {
    return instance.users.filter(user => user.user.id == id)[0].permissions.map(permission => permission.permission);
}