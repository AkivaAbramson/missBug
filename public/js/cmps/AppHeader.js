import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import LoginSignup from './LoginSignup.js'

export default {
	template: `
        <header class="app-header">
            <h1>Miss Bug</h1>
            <!-- <a href="/api/download" target="_blank">Download PDF</a>    -->
            <div class="user-login-container">
                <section v-if="user">
                    <p>Welcome {{user.fullname}}</p>                           <button @click="logout">Logout</button>
                </section>
                <section v-else>
                    <LoginSignup @setUser="onSetUser" />
                </section>
            </div>

            <nav>
                <RouterLink to="/">Home</RouterLink> |
                <RouterLink to="/bug">Bugs</RouterLink> |
                <RouterLink to="/about">About</RouterLink>
            </nav>
    </header>
        
    `,
    data() {
        return {
            user: userService.getLoggedinUser()
        }
    },
    methods: {
        onSetUser(user) {
            this.user = user
            this.$router.push('/')
        },
        logout() {
            userService.logout()
                .then(()=>{
                    this.user = null
                    this.$router.push('/')
                }) 
                .catch(err => {
                    console.log('Cannot logout', err)
                    showErrorMsg(`Cannot logout`)
                })
        }
    },
    components: {
        LoginSignup
    }
}
