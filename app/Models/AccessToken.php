<?php

namespace App\Models;

use Laravel\Passport\Token;

class AccessToken extends Token
{

    public function getRevokeAttribute()
    {
        return $this->is_revoked;
    }

    public function setRevokeAttribute($value)
    {
        return $this->attributes['is_revoked'] = $value;
    }
}
