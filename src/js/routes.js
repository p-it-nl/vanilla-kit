
/**
 * Page routes
 */
export const routes = new Map([
    ['/', { component: 'app-home', title: 'Home' }],    
    ['/board', { component: 'app-board', title: 'Board example' }],
    ['/other-page', { component: 'app-other-page', title: 'Other page' }],
    ['/404', { component: 'app-not-found', title: 'Not Found' }]
]);
