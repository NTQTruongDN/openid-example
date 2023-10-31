# Authentication using the Implicit Flow with Form Post

**Support:** this grant is most commonly used for JavaScript or mobile applications where the client credentials can't be securely stored.

- When using the Implicit Flow, all tokens are returned from the Authorization Endpoint; the Token Endpoint is not used.
- In Laravel docs, They said that they **no longer recommend using implicit grant tokens**


You can [read more in official docs](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth)

## Flows

### Common flow
Below is the common flow providing by OpenID Connect

![Implicit Flow](assets/IdP-Implict_flow.svg)

## Step by step

### 1. Preparing

Like the authorization flow, we must register the client. You can see more [in this section](./AUTHORIZATION-FLOW.MD#1-register-client--authorization-server-)

Enable Implicit
```php
//In App\Providers\AuthServiceProvider
/**
 * Register any authentication / authorization services.
 */
public function boot(): void
{
    Passport::enableImplicitGrant();
}
```

### 2. Authorization Server Authenticates End-User & User Authorize

**2.1. Define the login methods**

First of all, You must define the authentication methods and implement it in `Authorization Server`

**2.2. Implement authentication**

You must define the way to authenticate the user like authorization flow

### 3. Request token

When using the Implicit Flow, all tokens are returned from the Authorization Endpoint; the Token Endpoint is not used

Example with laravel app:
```php
// In route web.php
use Illuminate\Http\Request;
use Illuminate\Support\Str;

Route::get('/redirect', function (Request $request) {
    $request->session()->put('state', $state = Str::random(40));

    $query = http_build_query([
        'client_id' => 'client-id',
        'redirect_uri' => 'http://third-party-app.com/callback',
        'response_type' => 'token',
        'scope' => 'openid profile email',
        'state' => $state,
        // 'prompt' => '', // "none", "consent", or "login"
    ]);

    return redirect('http://passport-app.test/oauth/authorize?'.$query);
});

```

**3.1. Parameters:**
- response_type: With value `token`
- client_id: The client account
- redirect_uri: The client callback uri

**3.2. Redirect:**

```text
http://localhost:3001/auth/callback#
    access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YTdmNjgyZC04ZDU2LTRiZDMtOThiOS0zNmE2ZDZkNWVkYzgiLCJqdGkiOiJmNmE3MTg4NmM2YTQ4NGMzYThjOWFmODM4MmQ2NWI5MDc2Y2I5ZDYwNGE0MGM0NzJiYWRiNDM3NTBjYTdiZmM0MTY4ZDQxNzdlZmNhNmVhMiIsImlhdCI6MTY5ODczNjU4Ny40OTQ1MTEsIm5iZiI6MTY5ODczNjU4Ny40OTQ1MTQsImV4cCI6MTY5ODc0Mzc4Ny40ODg0NzEsInN1YiI6IjIiLCJzY29wZXMiOlsib3BlbmlkIl19.baE1PbQcXaZW5wzt6J4IoXyalYHjvsqsG-BC9DsWHc_hl6rpwz2redhYV5GXi2pj3YTG-N-XTRhnRGvhaqNqQ_Djn_N2TbErGdyf0AEV14IQm_mZw4k1L3zZumXyCjeLLpYT83-Ahy_2tLvDy2WmOT109cKVzqTkXYmazEq_DRII8Ya2AlC3tALcvM03O574E7YnmozFv8HZcdArXnW8hUDcWTvbr0bvJEibIu6QE_VvQVeg_YlJAx953dmxY3n-TmudsKETXJhpV6XEecBOuL44P5quiyxbiAoGIbrHm5NAXTzQd1_r45cScvvGL57U1v5mkniC_l7xdbFwwGaCjFtc4PxrgpIsMdvDYcMT5CR1DvTAV7yvw7NMQNbLWheND8LIa6qtotZK-0UqnGhvD1MRGJBnd4mJFEstqam0AwoYjnVnMypSpgBbmDu0ROWTVqbBsDsc8PFUAfmkbxfsYnO90MSPi55ILAvhiez1V-ji7f2F12X4B8GoYd_0-yNL6dW5GC8bMj7MTw8Sb5Cz3dziXqbvXgS9Q5mEDKkGaIIHwkXV7okjqHHo0-i8klEz8Dr5N6jyhmphvcB7un9o4lW0gx2DjwYVadwf_dUb-xcL_RGDYGyMyVllCpyrncj9rdviEh66mjdHjaaLM5UQjrcnftAOiA4mFSReYlp7tXk
    &token_type=Bearer&expires_in=7200&state=1234
```

### 4. Finish

You should save this `access_token` and `refresh_token` in local and use it for accessing to the owner resource.
