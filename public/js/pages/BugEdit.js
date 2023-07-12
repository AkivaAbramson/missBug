import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export default {
	template: `
    <section v-if="bugToEdit" class="bug-edit">
        <h1>{{(bugToEdit.id) ? 'Edit Bug': 'Add Bug'}}</h1>
        <form @submit.prevent="save">
            <label> 
                <span>Title: </span>
                <input type="text" v-model="bugToEdit.title" placeholder="Enter title...">
            </label>
            <label>
                <span>Severity: </span>
                <input type="number" v-model="bugToEdit.severity" placeholder="Enter severity..." min="0" max="3">
            </label>
			<label> 
                <span>Description: </span>
                <input type="text" v-model="bugToEdit.description" placeholder="Enter description...">
            </label>
			
            <div class="actions">
              <button type="submit"> {{(bugToEdit.id) ? 'Save': 'Add'}}</button>
              <button @click.prevent="closeEdit">Close</button>
            </div>
        </form>
    </section>
    `,
	data() {
		return {
			bugToEdit: null,
		}
	},
	created() {
		const { bugId } = this.$route.params
		if (!bugId) this.bugToEdit = bugService.getEmptyBug()
		else {
			bugService
				.getById(bugId)
				.then((bug) => {
					this.bugToEdit = bug
				})
				.catch((err) => {
					showErrorMsg('Cannot load bug for edit')
					this.$router.push('/bug')
				})
		}
	},

	methods: {
		save() {
			bugService
				.save(this.bugToEdit)
				.then((savedBug) => {
					showSuccessMsg('Bug saved')
					this.$router.push('/bug')
				})
				.catch((err) => {
					showErrorMsg('Cannot save bug')
				})
		},
		closeEdit() {
			this.$router.push('/bug')
		},
	},
}
