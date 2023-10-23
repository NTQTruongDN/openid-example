# Authentication using the Authorization Code Flow

- This section describes how to perform authentication using the Authorization Code Flow. When using the Authorization
  Code Flow, all tokens are returned from the Token Endpoint.
- The Authorization Code Flow returns an Authorization Code to the Client, which can then exchange it for an ID Token
  and an Access Token directly.

You can [read more in official docs](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)

## Flows

### Common flow

Below is the common flow providing by OpenID Connect

![authorization-flow](./assets/authorization-flow.svg)

### Detail default flow with passport

Below is the detailed flow when using Laravel Passport by default.

![authorization-flow-detail](./assets/authorization_flow_detail_with_passport.svg)

## Step by step

### 1. Register client (Authorization Server)

To implement an identity provider for authenticating consumer apps (also known as client apps), we first need to create
a corresponding client for each application

There are various methods to manage clients in Laravel Passport. However, we will utilize the `passport:client` command
for a quick client registration.

In practical projects, it is advisable to use a management screen instead of this approach.

In Consumer app, you might be created a callback endpoint and register this call back when you register client.

```shell
# Run the following command and input the prompt
# With native
php artisan passport:client

# With sail and docker
sail php artisan passport:client
```

Example:

![create-client command](./assets/create-client.png)

**Explanation:**

**Input:**

- **_Which user ID should the client assigned to?:_**
    - You can assign an exist user to this client
- **_What should we name the client?_**
    - Name of this client.
    - This name will be shown in the
      step [Authorization Server Authenticates End-User](#authorization-server-authenticates-end-user--user-authorize)
- **_Where should we redirect the request after authorization?_**
    - This is callback url that defined by consumer app.
    - The callback uri will be called by `Authorization Server` in step authentication and parsing authorize code.

**Output:**

- You will be received the `client_id` and `client_secret`.
- You might be saved this information and keep it secret

**WARNING:** You need to prepare an account for the steps below.

### 2. Defining Token Scopes

The scopes associated with Access Tokens determine what resources will be available when they are used to access OAuth
2.0 protected endpoints. Protected Resource endpoints MAY perform different actions and return different information
based on the scope values and other parameters used when requesting the presented Access Token.

Based on [OpenID Connect scope](https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims), we need defined some
scope:

```text
profile
  OPTIONAL. This scope value requests access to the End-User's default profile Claims, which are: name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate, zoneinfo, locale, and updated_at.
email
  OPTIONAL. This scope value requests access to the email and email_verified Claims.
```

- **openid**: to indicate that the application intends to use OIDC to verify the user's identity. See more
  in [standard claims](https://openid.net/specs/openid-connect-core-1_0.html#Claims)
- **profile**: to get name, nickname, and picture.
- **email**: to get email and email_verified.

### 3. Client send Authentication request to authorize endpoint (Consumer App)

We will scaffold the next app in `consumer-app` directory for making sample with Client.

Passport is already defined authorize endpoint is `/oauth/authorize`. We need to pass several params:

**_Parameters:_**

- client_id (REQUIRED)
    - Client Identifier that we register the above step
- scope (REQUIRED)
    - Define the
    - MUST contain the openid scope value.
- response_type (REQUIRED)
    - In this flow this value is `code`
- redirect_uri (REQUIRED)
    - Redirection URI to which the response will be sent. It should be HTTPS schema.
    - This is the URI callback we register it in the above step
- state (RECOMMEND)
    - The random string
    - Opaque value used to maintain state between the request and the callback.
    - Typically, Cross-Site Request Forgery (CSRF, XSRF) mitigation is done by cryptographically binding the value of
      this parameter with a browser cookie.

```text
Example

http://localhost/oauth/authorize?client_id=9a67e3f8-8133-4889-bf29-8514c743dc7c
    &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser
    &response_type=code
    &scope=openid
    &state=IIZsgmGJmjW4XDOoSJWU6C8xa1iCI9B0djbxXM01

Note: If no prompt value is provided, the user will be prompted for authorization only if they have not previously authorized access to the consuming application for the requested scopes.
```

**WARNING:** For using scope openid, you need to register token abilities in `AuthServiceProvider`.

### 4. Authorization Server Authenticates End-User & User Authorize

**4.1. Define the login methods**

First of all, You must define the authentication methods and implement it in `Authorization Server`

**4.2. Implement authentication**

**4.2.1. Implement authenticate by password**

In this sample project, we use [Laravel starter kit](https://laravel.com/docs/10.x/starter-kits#laravel-breeze) for
quickly implement authenticate by password

**4.3. Implement User Approving The Request form**

Laravel Passport provide the default view of authorize. You might publish this view for customize by the following command:
```shell
php artisan vendor:publish --tag=passport-views
```

### 5. Converting Authorization Codes To Access Tokens

If the user approves the authorization request, they will be redirected back to the consuming application.

```text
The sample URL for call callback client:
http://localhost:3000/auth/callback/authorization?code=def50....b3bfdb
```

**5.1. Request to token endpoint**

Passport is already defined authorize endpoint is `/oauth/token`.

**5.1.1. Parameters:**
- grant_type: With value `authorization_code`
- client_id: The client account
- client_secret: The client credential
- redirect_uri: The client callback uri
- code: `authorization_code` generated by Authorize Server in the above step

**5.1.2. Response:**

```json
{
    "token_type": "Bearer",
    "expires_in": 7200,
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YTY3ZTNmOC04MTMzLTQ4ODktYmYyOS04NTE0Yzc0M2RjN2MiLCJqdGkiOiI5MDdkY2U0MGIzMjk3ZTUyM2ZlMGUwZjJmNjJjMzFjZDE5MDM1ZTc3NjM2MjEwYjBiNDg0MDcxZjBkMWU0MTc4MjQ5YjFlOTcwYTY1ZDVjNiIsImlhdCI6MTY5Nzc4OTUyMS4wOTQyODcsIm5iZiI6MTY5Nzc4OTUyMS4wOTQyOSwiZXhwIjoxNjk3Nzk2NzIxLjA2NDkyNSwic3ViIjoiMSIsInNjb3BlcyI6W119.iiGxCHyKZ3HJeJIdzoPK3A6G99zy1q7MZXCiTrzgFsA54weBBl1fysDJYKFN4p2rBgfz-hU9IAgeEZtnYW6ClQshYym5Krazyydt4D0EWlyM_MOHRIsXIKh-sZGNXXXFnLC5plluuosdERumH_YhnMnV89mF_4Dp-FgfZqndFWEK1xBC7ZUZ-CJFQHsoleY0HZygL6vT0ujGhtO4EzsDdvXs8P73o8pUMYAM0ONhEHLXypQ18msi5i5ejx6KZSRkKb5KYMufXI7EohzC-N78wTjX6JA4on0swk46Bj9WgOTBIxQDRMYF1oWlxYBTUOOOO6Pv8_EpqiOYQbTlYRt5mUOc5-62ajEDD0w7ryd4kLRBkxflpJpGsbVjL9cMiyC7SR0H3MlLRdX9bBo0YjHXbL91mY8ncGaEyrICUmWTGEo9WMsh4yNyS-OD6YdQApCkWUChCVXtEusvVWiWFH09xAcyJslgYutEXrhddqfJt3PZGTeA68BDOlpoDXZJdhTsixbh09xbJAejJ0oSVD9VYFLsz63F7QpvyLSNAql4GT-bXwtT-0fAm1mqZkdE4ZI6N9w1h22rVG91Znw3jOFm8-Yy9DOJNRkK6QQHnwoi9jlPCIBypVpzpgkkTcSBkIg7Aizxs3-xVuoV89xs3CN7OY0IZCdN0xXYzyGk-dOM2n0",
    "refresh_token": "def50200f3d954d714677c4144d2cef4735a9bebee87902e558cc1c1667401c628ebd07cfc740127315a1a8e802866b0ff91a0e2f01283ffd22ed1ef3ff96a194f6be8ffa899badfd8c0eb06056f8693ceaf894a3fce1946e22660e97a9524b15b633f64dd84eec4c85104f6bd49ed7569bafc4a102b82031514d91770cda1a97a87bc3ed2a85e8ce5372ef45eecb77f19e8cebd28235c03a6d6cbf1685a91f85666c9f51c515c420acd9aa428b02eb1812fde9e6b471d51736b553a1084fe3fbc75df81749b5f18b113015951b316f394603f19ee3b7863663226daeb4cdcec55242e989cc66f0a73be1f82720be02ae214007dd7280d73cc5f8332ecb74eb6bad024d00874cb58699d6b39e6cf7e882d3acf606240715d57f33fb229c9815a51d46c9ae94caac0b8ca6e1221a227c9939a06c806669fd2c6cf74577622a9a394a4c2cd7467bc5c9665d419be8e67691b4e99c11465b010bdd846799d5dc1afc4684089c4dfb24915bbb4eb6095986cb2de0d1253f60c6b3fe4400c1ecd7a7a0acad315"
}
```

### 6. Finish

You should save this `access_token` and `refresh_token` in local and use it for accessing to the owner resource.
