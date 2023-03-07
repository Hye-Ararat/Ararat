import Provider, {Configuration} from 'oidc-provider';


const configuration : Configuration = {
    scopes: ['openid', 'profile', 'email'],
    clients: [
        {
            client_id: 'foo',
            client_secret: 'bar',
            redirect_uris: ["http://localhost:3000/authentication/callback"],
            client_name: "Apple",
            logo_uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Apple_logo_white.svg/1200px-Apple_logo_white.svg.png",
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
            return `https://us-dal-1.hye.gg/authentication/login?interaction=${interaction.uid}`;
        }
    }
};
let oidc : Provider;
if (process.env.NODE_ENV === 'production') {
    oidc = new Provider('https://us-dal-1.hye.gg/api/authentication', configuration);
    oidc.listen(3002, () => {
        console.log("OIDC Service listening on 3002")
    })

} else {
    if (!global.oidc) {
        global.oidc = new Provider('https://us-dal-1.hye.gg/api/authentication', configuration);
        global.oidc.listen(3002, () => {
            console.log("OIDC Service listening on 3002")
        })
    }
    oidc = global.oidc;
}

oidc.proxy = true;
export default oidc;