import Provider, {Configuration} from 'oidc-provider';


const configuration : Configuration = {
    scopes: ['openid', 'profile', 'email'],
    clients: [
        {
            client_id: 'foo',
            client_secret: 'bar',
            redirect_uris: ["http://localhost:4000/callback"],
            client_name: "Company Name",
            logo_uri: "https://img.logoipsum.com/220.svg",
            scope: "openid profile email"
        },
        {
            client_id: 'test',
            client_secret: 'test',
            redirect_uris: ["http://127.0.0.1:5556/auth/lxd/callback"],
            client_name: "LXD",
            logo_uri: "https://img.logoipsum.com/220.svg",
            scope: "openid profile email"
        }
    ],
    routes: {
        authorization: '/api/authentication/auth',
        backchannel_authentication: '/api/authentication/backchannel',
        code_verification: '/api/authentication/device',
        device_authorization: '/api/authentication/device/auth',
        end_session: '/api/authentication/session/end',
        introspection: '/api/authentication/token/introspection',
        jwks: '/api/authentication/jwks',
        pushed_authorization_request: '/api/authentication/request',
        registration: '/api/authentication/reg',
        revocation: '/api/authentication/token/revocation',
        token: '/api/authentication/token',
        userinfo: '/api/authentication/me'
    },
    features: {
        devInteractions: {
            enabled: false
        }
    },
    interactions: {
        url(ctx, interaction) {
            console.log(interaction)
            if (interaction.prompt.name == "login") {
            return `https://us-dal-1.hye.gg/authentication/login?interaction=${interaction.uid}`;
            }
            if (interaction.prompt.name == "consent") {
            return `https://us-dal-1.hye.gg/authentication/authorize?interaction=${interaction.uid}`;
            }
        }
    },
    findAccount(ctx, sub, token) {
        console.log(sub, "THIS IS THE SUB")
        return {
            accountId: sub,
            async claims(use, scope, claims, rejected) {
                console.log(use, scope, claims, rejected, "THIS IS THE CLAIMS")
                return {
                    sub: sub,
                }
            }
        }
    }
};
let oidc : Provider;
let listenInProg = false;



export function provider() {
    if (process.env.NODE_ENV === 'production' && !listenInProg && !oidc) {
        oidc = new Provider('https://us-dal-1.hye.gg/api/authentication', configuration);
        listenInProg = true;
        oidc.listen(3002, () => {
            listenInProg = false;
            console.log("OIDC Service listening on 3002")
        })
    } else {
        if (!global.oidc && !listenInProg && !oidc) {
            global.oidc = new Provider('https://us-dal-1.hye.gg/api/authentication', configuration);
            listenInProg = true;
            global.oidc.listen(3002, () => {
                listenInProg = false;
                console.log("OIDC Service listening on 3002")
            })
        }
        oidc = global.oidc;
    }
    oidc.proxy = true;
    return oidc;
}