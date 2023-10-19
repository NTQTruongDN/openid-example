<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        $this->configureOauth();
    }

    protected function configureOauth()
    {
//        Passport::ignoreRoutes();
        Passport::tokensExpireIn(now()->addSeconds(config('passport.token_lifetimes.tokens')));
        Passport::refreshTokensExpireIn(now()->addSeconds(config('passport.token_lifetimes.refresh_tokens')));
        Passport::personalAccessTokensExpireIn(
            now()->addSeconds(config('passport.token_lifetimes.personal_access_token'))
        );
    }
}
