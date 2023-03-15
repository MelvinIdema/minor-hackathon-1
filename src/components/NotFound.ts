import { render } from "../utils/spaghettiRouter";

export default async function NotFound() {
    return await render('404.html', {});
}