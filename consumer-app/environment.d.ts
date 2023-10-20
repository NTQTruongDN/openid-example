declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly NEXT_PUBLIC_AUTH_DOMAIN: string
    readonly NEXT_PUBLIC_CLIENT_ID: string
    readonly NEXT_PUBLIC_BASE_URL: string
    readonly CLIENT_SECRET: string
  }
}
