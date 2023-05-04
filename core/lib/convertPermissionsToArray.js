export default function convertPermissionsToArray(permissions) {
    let perms = [];
    permissions.forEach(permission => {
        perms.push(permission.permission);
    })
    return perms;
}