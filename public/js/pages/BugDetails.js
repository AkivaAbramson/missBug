import { bugService } from '../services/bug.service.js'

export default {
	template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
		<h3>{{bug.description}}</h3>
		<h3>{{bug.createdAt}}</h3>
		<h3>{{bug.labels}}</h3>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <RouterLink to="/bug">Back</RouterLink>
    </section>
    `,
	data() {
		return {
			bug: '',
		}
	},
	created() {
		// const { bugId } = this.$route.params
		// bugService
		// 	.getById(bugId)
		// 	.then((bug) => {
		// 		this.bug = bug
		// 		console.log(bug)
		// 	})
		// 	.catch((err) => {
		// 		alert('Cannot load bug')
		// 		this.$router.push('/bug')
		// 	})
		this.loadBug()
	},
	computed: {
        bugId() {
            return this.$route.params.bugId
        }
    },
    watch: {
        bugId() {
            console.log('BugId Changed!')
            this.loadBug()
        }
    },
    methods: {
        loadBug() {
            bugService.getById(this.bugId)
                .then(bug => this.bug = bug)
        }
    }
}
