export type APIResponse<T> = {
    type: string,
    status: string,
    status_code: number,
    metadata: T
}