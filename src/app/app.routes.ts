import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Requests } from './pages/dashboard/pages/requests/requests';
import { Reports } from './pages/dashboard/pages/reports/reports';
import { Profile } from './pages/dashboard/pages/profile/profile';
import { AuthGuard } from './guard/auth-guard';
import { ForgetPassword } from './pages/forget-password/forget-password';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'',
        component:Layout,
        children:[
            {
                path:'dashboard',
                component:Dashboard,
                children: [
                    { path: '', redirectTo: 'requests', pathMatch: 'full' },
                    { path: 'requests', component: Requests,canActivate:[AuthGuard] },
                    { path: 'reports', component: Reports,canActivate:[AuthGuard] },
                    { path: 'profile', component: Profile,canActivate:[AuthGuard] },
                ]
            },
        ]
    },
    {
        path:'forget-password',
        component:ForgetPassword,
        canActivate:[AuthGuard]
    }
];
