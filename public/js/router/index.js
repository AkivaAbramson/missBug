import BugIndex from '../pages/BugIndex.js'
import BugEdit from '../pages/BugEdit.js'
import BugDetails from '../pages/BugDetails.js'
import HomePage from '../pages/HomePage.js'
import AboutPage, {AboutTeam, AboutServices} from '../pages/AboutPage.js'
import userDetails from '../pages/UserDetails.js'

const { createRouter, createWebHashHistory } = VueRouter

// const options = {
// 	history: createWebHashHistory(),
// 	routes: [
// 		{
// 			path: '/',
// 			redirect: '/bug',
// 		},
// 		{
// 			path: '/bug',
// 			component: BugIndex,
// 		},
// 		{
// 			path: '/bug/:bugId',
// 			component: BugDetails,
// 		},
// 		{
// 			path: '/bug/edit/:bugId?',
// 			component: BugEdit,
// 		},
// 	],
// }

const options = {
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: HomePage
        },
        {
            path: '/about',
            component: AboutPage,
            children: [
                {
                    path: 'team',
                    component: AboutTeam
                },
                {
                    path: 'services',
                    component: AboutServices
                },
            ]
        },
        {
            path: '/bug',
            component: BugIndex
        },
        {
            path: '/bug/:bugId',
            component: BugDetails
        },
        {
            path: '/bug/edit/:bugId?',
            component: BugEdit
        },
        {
            path: '/bug/profile',
            component: userDetails
        },
        // Last fallback if no route was matched:
        {
            path: '/:catchAll(.*)',
            component: AboutPage
        }
    ]
}
export const router = createRouter(options)
