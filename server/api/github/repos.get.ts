export default defineEventHandler(async (event) => {
  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)

  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: 'pushed',
    per_page: 100
  })

  return data.map(repo => ({
    owner: repo.owner.login,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description
  }))
})
