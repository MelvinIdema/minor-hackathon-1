import initRouter from './utils/spaghettiRouter'
import Home from './components/Home'
import Single from './components/Single'
import NotFound from "./components/NotFound";

import 'normalize.css'
import './style.css'
import './loader.css'

initRouter({
    '/': Home,
    '/featured/:repo': Single,
    '/404': NotFound,
    }, document.getElementById('#app')
)