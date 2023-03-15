/**
 * Sources:
 * - https://dev.to/skaytech/build-a-custom-spa-router-using-vanillajs-4a9l
 * - https://dev.to/pixari/build-a-very-basic-spa-javascript-router-2k4p
 * - https://www.section.io/engineering-education/how-to-build-a-simple-router-in-javascript
 */

type CachedHtml = { [x: string]: string }
type Routes = { [x: string]: Function }

const cachedHtml: CachedHtml = {}

const showLoader = () => {
    const loaderEl = document.querySelector<HTMLDivElement>('#loader')

    if (loaderEl === null) throw new Error('No element found with ID loader')
    return loaderEl.style.display = 'grid'
}
const hideLoader = () => {
    const loaderEl = document.querySelector<HTMLDivElement>('#loader')

    if (loaderEl === null) throw new Error('No element found with ID loader')
    return loaderEl.style.display = 'none'
};

/**
 * Parses the location by removing the /#
 * @returns {string|string}
 */
const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
const redirect = (path: string) => window.location.hash = path;

/**
 * Checks the HTML for templating
 * If templating is found it'll loop over each variable and
 * replaces it with the corresponding param. Only works with Strings.
 * Returns the HTML as a string.
 * @param view
 * @param params
 * @param callback
 * @returns {Promise<*|string>}
 */
async function render(view: string, params: { [x: string]: string }, callback: Function = () => null) {
    let html = await loadHtml(view);

    const matches = [...html.matchAll(/{{(.+)}}/gm)];
    if (matches.length === 0) return [html, callback];

    matches.forEach(match => {
        if (params[match[1]]) {
            html = html.replace(`${match[0]}`, `${params[match[1]]}`);
        }
    });

    return [html, callback];
}

/**
 * Fetches the HTML from a given view and returns the content as a String.
 * Caches the HTML in a global cachedHtml object so that
 * the application does not make unnecessary requests.
 * @param view
 * @returns {Promise<string|*>}
 */
async function loadHtml(view: string) {
    if (cachedHtml[view]) return cachedHtml[view];

    const res = await fetch(`/views/${view}`);
    const html = await res.text();
    cachedHtml[view] = html;

    return html;
}

/**
 * Checks the routes object for a matching route
 * If no matching route is found it redirects the user to the 404 location.
 * If the SPA is visited without the hash identifier the app will redirect
 * with a /#/ in the URL.
 * @param routes
 * @returns {Promise<string>}
 */
async function router(routes: Routes, rootEl: HTMLElement | null) {
    const app = rootEl || document.getElementById('app')

    if (app === null) throw new Error('No app element found.')

    const path = parseLocation()
    if (path === '/') window.location.hash = '/'

    /**
     * This part of the code is responsible for grabbing URL query
     * !!Super Buggy!!
     */
    // If the route does not match any routes
    if (!routes[path]) {
        // Check if the first part of the route matches any route
        const splitted = path.split('/').slice(1)
        const routeNames = [...Object.keys(routes)]
        const regex = new RegExp(`^\/${splitted[0]}\/:(.+)`, 'gi')
        const matched = routeNames.filter(routeName => !!routeName.match(regex))[0]

        // If not, redirect to 404
        if (!matched) return window.location.hash = '/404'

        // if the first part matches any routes; we probably want a query.
        // So treat second part of route as query
        const query = splitted[1]
        const [html, callback] = await routes[`${matched}`](query)
        app.innerHTML = html
        if (callback !== null) callback()
        return ""
    }

    const [html, callback] = await routes[path]()
    app.innerHTML = html
    if (callback !== null) return callback()
}

/**
 * Initializes the router by attaching two eventListeners to the window.
 * @param routes
 * @param rootEl
 */
function initRouter(routes: Routes, rootEl: HTMLElement | null) {
    const el = rootEl ?? document.getElementById('app')

    window.addEventListener('load', () => router(routes, el))
    window.addEventListener('hashchange', () => router(routes, el))
}

export default initRouter
export {render, redirect, showLoader, hideLoader}