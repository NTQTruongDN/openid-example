import React from "react";
import {redirect} from "next/navigation";

export default function useAuth() {
    const loginWithRedirect = function (e: React.FormEvent) {
        e.preventDefault()

        const params = new URLSearchParams();
        params.set('client_id', process.env.NEXT_PUBLIC_CLIENT_ID);
        params.set('response_type', 'code');
        params.set('redirect_uri', process.env.NEXT_PUBLIC_BASE_URL);
        params.set('scope', '');
        params.set('state', 'test123');

        window.location.href = 'http://localhost/oauth/authorize?' + params.toString()
    }

    const parseAuthorizeCodeToAccessToken = (authorize_code) => {

    }

    return {
        loginWithRedirect
    }
}
