import { utilService } from "../services/util.service.js"

export default {
	template: `
        <section class="bug-filter">
            <span>Filter by title: </span>
            <input placeholder="Search" type="text" v-model="filterBy.title">
            <span>Filter by severity: </span>
			<input 
                v-model.number="filterBy.severity"
                placeholder="severity"
                type="number"
                min="0" max="3" />
            <br>
            <label for="bugs">Filter by labels:</label>
			<select name="bug-type" id="bug-type" v-model="filterBy.labels" multiple>
				<option value="critical">Critical</option>
				<option value="need-CR">Need-CR</option>
				<option value="dev-branch">Dev-branch</option>
			</select>

			<select v-model="sortBy.type">
				<option value="">Sort By</option>
				<option value="title">Title </option>
				<option value="severity">Severity</option>
				<option value="createdAt">Created At</option>
			</select>
			<select v-model="sortBy.dir">
					<option value="" disabled>Sort Direction</option>
					<option value="1">Ascending</option>
					<option value="-1">Descending</option>
			</select>  
        </section>
    `,
	data() {
		return {
			filterBy: {
				title: '',
				severity: 0,
                labels: []
			},
			sortBy: {
				type: 'title',
				dir: '1'
			}
		}
	},
	created() {
        this.filter = utilService.debounce(() => {
            this.$emit('filter', this.filterBy)
        }, 500)
		this.sort = utilService.debounce(() => {
			this.$emit('sort', this.sortBy)
		  }, 450)
    },
	watch: {
		filterBy: {
			handler() {
				this.filter()
				
			},
			deep: true,
		},
		sortBy: {
			handler() {
			  this.sort()
			},
			deep: true,
		  },
	},
}
