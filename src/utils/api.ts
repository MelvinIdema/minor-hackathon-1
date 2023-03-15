// const apiUrl = `https://api.github.com`
// const pinnedRepoApiUrl = `https://gh-pinned-repos.egoist.dev/?username=`;

const apiUrl = `http://localhost:3000`
const pinnedRepoApiUrl = `http://localhost:3000/users/pinned/`


/**
 * https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript
 */
async function fetchUserInformation(username: String): Promise<any> {
    const res = await fetch(`${apiUrl}/users/${username}`)
    if(!res.ok) throw new Error(res.statusText)
    return await res.json()
}

async function fetchPinnedReposFromUser(username: string): Promise<any> {
    const res = await fetch(`${pinnedRepoApiUrl}${username}`)
    if(!res.ok) throw new Error(res.statusText)
    return await res.json()
}

export {
    fetchUserInformation,
    fetchPinnedReposFromUser
}