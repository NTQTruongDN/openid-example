import {NextApiRequest, NextApiResponse} from "next";
import useAuth from "../../../../hooks/useAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {parseAuthorizeCodeToAccessToken} = useAuth();
  parseAuthorizeCodeToAccessToken(req.query.code)
    .then(r => r.json())
    .then(data => {
      res.setHeader('Set-Cookie', 'access_token=' + data.access_token + '; Max-Age=900000; Path=/; HttpOnly')
      res.redirect('/');
    }).catch(err => {
    console.error(err)
  })
}
