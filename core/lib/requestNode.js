import axios from "axios";
import getNodeAccessToken from "./getNodeAccessToken";

export async function post(node, endpoint, body) {
    return new Promise(async (resolve, reject) => {
        let data;
        try {
            data = (
                await axios.post(`${node.ssl ? "https" : "http"}://${node.hostname}:${node.port}${endpoint}`, body, {
                    headers: {
                        Authorization: `Bearer ${getNodeAccessToken(node.accessTokenIV, node.accessToken)}`
                    }
                })
            ).data;
        } catch (error) {
            return reject(error);
        }
        return resolve(data);
    });
}

export async function get(node, endpoint) {
    return new Promise(async (resolve, reject) => {
        let data;
        try {
            data = (
                await axios.get(`${node.ssl ? "https" : "http"}://${node.hostname}:${node.port}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${getNodeAccessToken(node.accessTokenIV, node.accessToken)}`
                    }
                })
            ).data;
        } catch (error) {
            return reject(error);
        }
        return resolve(data);
    });
}

export async function del(node, endpoint) {
    return new Promise(async (resolve, reject) => {
        let data;
        try {
            data = (
                await axios.delete(`${node.ssl ? "https" : "http"}://${node.hostname}:${node.port}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${getNodeAccessToken(node.accessTokenIV, node.accessToken)}`
                    }
                })
            ).data;
        } catch (error) {
            return reject(error);
        }
        return resolve(data);
    });
}

export async function put(node, endpoint, body) {
    return new Promise(async (resolve, reject) => {
        let data;
        try {
            data = (
                await axios.put(`${node.ssl ? "https" : "http"}://${node.hostname}:${node.port}${endpoint}`, body, {
                    headers: {
                        Authorization: `Bearer ${getNodeAccessToken(node.accessTokenIV, node.accessToken)}`
                    }
                })
            ).data;
        } catch (error) {
            return reject(error);
        }
        return resolve(data);
    });
}
