import { render, showLoader, hideLoader } from "../utils/spaghettiRouter"
import {fetchPinnedReposFromUser, fetchUserInformation} from "../utils/api"

export default async function Home() {
    showLoader()

    const userInfo = await fetchUserInformation('MelvinIdema')
    const pinnedRepos = await fetchPinnedReposFromUser('MelvinIdema')
    console.log(pinnedRepos)

    function afterRender() {
        const featuredWorkContainer = document.querySelector<HTMLElement>('#featuredWork')
        console.log(featuredWorkContainer)
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')

        pinnedRepos.forEach((repo: { [x: string]: any; }, index: number) => {
            const repoEl = `
             <article
                  style="background-image: url('${repo["image"]}')">
                  <a href="${repo['link']}"></a>
                <div>
                  <h1>${repo["repo"]}</h1>
                  <h2>${repo["website"]}}</h2>
                </div>
             </article>       
            `
            if(index === 0) div1.insertAdjacentHTML("beforeend", repoEl)
            if(index !== 0) div2.insertAdjacentHTML("beforeend", repoEl)
        })

        if(featuredWorkContainer) {
            featuredWorkContainer.appendChild(div1)
            featuredWorkContainer.appendChild(div2)
        }
    }

    hideLoader()
    return await render('home.html', {
        avatarUrl: userInfo['avatar_url'],
        username: userInfo['login'],
        bio: userInfo['bio']
    }, afterRender)
}