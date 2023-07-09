export function redirect(destination: string) {
    return { redirect: { permanent: false, destination } }
}