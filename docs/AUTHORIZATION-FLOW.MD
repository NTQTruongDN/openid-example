# Authentication using the Authorization Code Flow

- This section describes how to perform authentication using the Authorization Code Flow. When using the Authorization
  Code Flow, all tokens are returned from the Token Endpoint.
- The Authorization Code Flow returns an Authorization Code to the Client, which can then exchange it for an ID Token
  and an Access Token directly.

You can [read more in official docs](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)

## Flows

![authorization-flow](./assets/authorization-flow.svg)

## Implement with Laravel passport

### Client send Authentication request to authorize endpoint

We will scaffold the next app in `consumer-app` directory for making sample with Client.

Passport is already defined authorize endpoint is `/oauth/authorize`. We need to pass several params:

```text
client_id (REQUIRED)
  Client Identifier that we register above
scope (REQUIRED)
  MUST contain the openid scope value.
response_type (REQUIRED)
  In this flow this flow is `code`
redirect_uri (REQUIRED)
  Redirection URI to which the response will be sent. It should be HTTPS schema
prompt (OPTIONAL)
  the Authorization Server prompts the End-User for re-authentication and consent. This prompt will use in the next step.

=> We have url like that:
http://localhost/oauth/authorize?client_id=9a67e3f8-8133-4889-bf29-8514c743dc7c
    &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser
    &response_type=code
    &scope=
    &state=IIZsgmGJmjW4XDOoSJWU6C8xa1iCI9B0djbxXM01

Note: If no prompt value is provided, the user will be prompted for authorization only if they have not previously authorized access to the consuming application for the requested scopes.
```

### Authorization Server Authenticates End-User

After user approve

http://localhost:3000/user?code=def5020031b78c6297f7554b84a4bdcc4de8d032d5830216f1d61efc31b53b05cde40e353445cbf4177d7328b82e2e245ee45c793985b5007f2f72d85d70e10e070ebd0abd9f216572f13384f8dfa0a6ee28af18bc9d40ecac2b38dbf5e46d023e932d351e442983c0d419d9b4f472d258ee335034511cb055cf19e218f607a5113e4ce029e5e174adba5a61ebab27218480d449823dab045867674e349d68ad7cc93ad4472475ac640512ff983549731c931f6ca503ad2677abbcae3f9e8f9254077d448ea5c9c4bc0dd0d5e707123906aa625a80bcb748fc0906245830266b57656539340aea17852000d62283c6ede410371cc75e088059abd88c9276b76848e9fb362c0b8fadb2b63a24a92603de03554b0e80a41aa2d879d2c0a412a7d58219c193e689aa1ea0eef63eb442b286a2dec914114809d62f5dda5649d13e550a54141f241febf8f235e8f1d0e28d36690973cdd770d8bd15d0515cac5eba26563fd82ba3e90a44488dd0a14694bb5f75618b8a075726050cd3b3bfdb
