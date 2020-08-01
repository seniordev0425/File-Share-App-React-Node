import { OAuthLink } from 'store/modules/storage'


export const oauthLink = OAuthLink({
  provider: 'googledrive',
  redirect_url: 'http://localhost/storage/link?code=dummycode&state=dummystate',
  return_url: 'https://accounts.google.com/signin/oauth?client_id=dummy-client-id.apps.googleusercontent.com',
})
