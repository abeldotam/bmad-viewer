declare module '#auth-utils' {
  interface User {
    id: number
    login: string
    name: string
    avatarUrl: string
    githubToken: string
  }
}

export {}
