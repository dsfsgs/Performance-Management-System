import { useUserStore } from '../stores/userStore'
import AuthLayout from 'layouts/AuthLayout.vue'
import AdminLayout from 'layouts/MainLayout.vue'
import Login from '../pages/Auth/LoginPage.vue'

// HR Admin Pages
import HRDashboard from 'src/pages/HR/HRDashboard.vue'
import HRUnitWorkPlan from 'src/pages/HR/UnitWorkPlan.vue'
import HROPCR from 'src/pages/HR/OPCR.vue'
import HRIPCR from 'src/pages/HR/IPCR.vue'
import HRAccount from 'src/pages/HR/Account.vue'

// Office Admin Pages
import OfficeDashboard from 'pages/Office/OfficeDashboard.vue'
import OfficeEmployee from 'pages/Office/Employee.vue'
import OfficeUnitWorkPlan from 'pages/Office/UnitWorkPlan.vue'
import OfficeOPCR from 'pages/Office/OPCR.vue'
import OfficeIPCR from 'pages/Office/IPCR.vue'
import OfficeAccount from 'pages/Office/Account.vue'

// Planning Admin Pages
import PlanningDashboard from 'pages/Planning/PlanningDashboard.vue'
import PlanningUnitWorkPlan from 'pages/Planning/UnitWorkPlan.vue'
import PlanningOPCR from 'pages/Planning/OPCR.vue'
import PlanningAccount from 'pages/Planning/Account.vue'

export const routes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [{ path: '', component: Login }],
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      // Root redirect
      {
        path: '',
        redirect: () => {
          const userStore = useUserStore()
          const role = userStore.user?.role

          switch (role) {
            case 'hr-admin':
              return '/hr/dashboard'
            case 'office-admin':
              return '/office/dashboard'
            case 'planning-admin':
              return '/planning/dashboard'
            default:
              return '/login'
          }
        },
      },
      // HR Admin Routes
      {
        path: 'hr/dashboard',
        component: HRDashboard,
        meta: { role: 'hr-admin' },
      },
      {
        path: 'hr/unit-work-plan',
        component: HRUnitWorkPlan,
        meta: { role: 'hr-admin' },
      },
      {
        path: 'hr/opcr',
        component: HROPCR,
        meta: { role: 'hr-admin' },
      },
      {
        path: 'hr/ipcr',
        component: HRIPCR,
        meta: { role: 'hr-admin' },
      },
      {
        path: 'hr/account',
        component: HRAccount,
        meta: { role: 'hr-admin' },
      },

      // Office Admin Routes
      {
        path: 'office/dashboard',
        component: OfficeDashboard,
        meta: { role: 'office-admin' },
      },
      {
        path: 'office/employee',
        component: OfficeEmployee,
        meta: { role: 'office-admin' },
      },
      {
        path: 'office/unit-work-plan',
        component: OfficeUnitWorkPlan,
        meta: { role: 'office-admin' },
      },
      {
        path: 'office/opcr',
        component: OfficeOPCR,
        meta: { role: 'office-admin' },
      },
      {
        path: 'office/ipcr',
        component: OfficeIPCR,
        meta: { role: 'office-admin' },
      },
      {
        path: 'office/account',
        component: OfficeAccount,
        meta: { role: 'office-admin' },
      },

      // Planning Admin Routes
      {
        path: 'planning/dashboard',
        component: PlanningDashboard,
        meta: { role: 'planning-admin' },
      },
      {
        path: 'planning/unit-work-plan',
        component: PlanningUnitWorkPlan,
        meta: { role: 'planning-admin' },
      },
      {
        path: 'planning/opcr',
        component: PlanningOPCR,
        meta: { role: 'planning-admin' },
      },
      {
        path: 'planning/account',
        component: PlanningAccount,
        meta: { role: 'planning-admin' },
      },
    ],
  },
]

// Route Guard to Protect Routes
export function setupRouterGuard(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    userStore.loadUser() // Load user from storage

    if (to.path !== '/login' && !userStore.user?.role) {
      next('/login') // Redirect if not logged in
    } else if (to.meta.role && to.meta.role !== userStore.user?.role) {
      next('/login') // Redirect if the user doesn't have the correct role
    } else {
      next()
    }
  })
}
