<p align="center"><img src="https://raw.githubusercontent.com/laravel/socialite/116b2330e0d37a9f10374084e7d83fbbddea1e9a/art/logo.svg" alt="Logo Laravel Socialite"></p>

## About Example My Own Identity Provider

We use the flowing packages and tools to develop the IdP:

- [Passport Package](https://laravel.com/docs/10.x/passport): Authentication package
- [Sail Package](https://laravel.com/docs/10.x/sail): Development environment with Docker and PHP 8.2 runtime, MySQL

## Preparation

Setup your environment and install required packages

1. Install laravel passport

```shell
# Install with native composer
composer require laravel/passport

# Install with sail and docker
sail composer require laravel/passport
```

2. Run migration
First and foremost, you must run the default migration if you want to utilize the default database structure provided by `laravel/passport`

```shell
# With native
php artisan migrate

# With sail
sail php artisan migrate
```

3. Install passport

This command will create the encryption keys necessary for generating secure access tokens and will also create 
'personal access' and 'password grant' clients used for generating access tokens.
We use the `--uuids` option to employ Client UUIDs instead of auto-increment IDs.

The secret and public key will store in `storage` path with name `oauth-private.key` and `oauth-public.key`

```shell
# With native
php artisan passport:install --uuids

# With sail
sail php artisan passport:install --uuids
```

4. Add the Laravel\Passport\HasApiTokens trait to your App\Models\User model.

```php
<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
 
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

5. Set up token lifetimes

To dynamically set up token lifetimes, we need to add additional key configurations to passport.php.

```php
'token_lifetimes' => [
    'tokens' => env('TOKEN_LIFETIMES', 2*60*60), // Unit seconds
    'refresh_tokens' => env('REFRESH_TOKEN_LIFETIMES', 4*60*60), // Unit seconds
    'personal_access_token' => env('ACCESS_TOKEN_LIFETIMES', 24*60*60), // Unit seconds
]
```

Then, we need to register the configuration in the `boot` method of Class `App\Providers\AuthServiceProvider`

```php
/**
 * Register any authentication / authorization services.
 */
public function boot(): void
{
    Passport::tokensExpireIn(now()->addSeconds(config('passport.token_lifetimes.tokens')));
    Passport::refreshTokensExpireIn(now()->addSeconds(config('passport.token_lifetimes.refresh_tokens')));
    Passport::personalAccessTokensExpireIn(
        now()->addSeconds(config('passport.token_lifetimes.personal_access_token'))
    );
}
```

## OpenId Connect core

The instructions above help you integrate `laravel\passport` into a Laravel project.

Let's continue and gather some information about OpenID Connect.

[OpenID Connect 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
is a simple identity layer on top of the OAuth 2.0 protocol.

This specification defines the core OpenID Connect functionality: authentication built on top of OAuth 2.0 and the use
of Claims to communicate information about the End-User.

It also describes the security and privacy considerations for using OpenID Connect.

## How to implement?
Now, we dive into how to implement the IdP with some common flows.

OpenID Connect supports 3 main Authentication flow:

- [Authorization Code Flow](./docs/AUTHORIZATION-FLOW.MD)
- [Implicit Flow](./docs/IMPLICIT-FLOW.MD)
- [Hybrid Flow](./docs/HYBRID-FLOW.MD)

## References
- https://laravel.com/docs/10.x/passport
- https://laravel.com/docs/10.x/sail
- https://auth0.com/docs/get-started/authentication-and-authorization-flow
- https://openid.net/specs/openid-connect-core-1_0.html
