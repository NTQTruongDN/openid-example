import {NextApiRequest, NextApiResponse} from "next";
import useAuth from "../../../../hooks/useAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {parseAuthorizeCodeToAccessToken} = useAuth();
  parseAuthorizeCodeToAccessToken(req.query.code)
    .then(r => r.json())
    .then(data => {
      // TODO: Validate response
      res.setHeader('Set-Cookie', 'access_token=' + data.access_token + '; Max-Age=' + data.expires_in + '; Path=/; HttpOnly')
      res.redirect('/');
    }).catch(err => {
    //TODO: Handle Authorize failed
    console.error(err)
  })
}
