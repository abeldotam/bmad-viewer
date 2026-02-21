declare module '#auth-utils' {
  interface User {
    id: number
    login: string
    name: string
    avatarUrl: string
  }

  interface SecureSessionData {
    githubToken: string
  }
}

export {}
