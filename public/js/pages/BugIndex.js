import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import BugFilter from '../cmps/BugFilter.js'
import BugList from '../cmps/BugList.js'

export default {
	template: `
		<section class="bug-app">
			
			<!-- <img @click="onDownloadPDF" class="pdf-icon" src="img/pdf.png" alt="pdf.png" title="Download as pdf"> -->
			<div class="subheader">
			<BugFilter @filter="setFilterBy"
					   @sort="setSortBy"/>
				<RouterLink to="/bug/edit">Add New Bug</RouterLink> 
			</div>
			<BugList v-if="bugs" :bugs="bugs" @remove="removeBug"/>
		</section>

		<section class="pagination">
                <button @click="getPage(-1)">Prev</button>
                <button @click="getPage(1)">Next</button>
    	</section>
    `,
	data() {
		return {
			bugs: [],
			filterBy: {title: '', severity: 0, labels: [], pageIdx: 0},
			sortBy: {type: '', dir: 1}
		}
	},
	created() {
		
		this.loadBugs()
	},
	methods: {
		loadBugs() {
            bugService.query(this.filterBy, this.sortBy)
                .then(bugs => this.bugs = bugs)
                .catch(err => {
                    showErrorMsg('Cannot load bugs')
                })
        },
		removeBug(bugId) {
			bugService
				.remove(bugId)
				.then(() => {
					const idx = this.bugs.findIndex((bug) => bug._id === bugId)
					this.bugs.splice(idx, 1)
					showSuccessMsg('Bug removed')
				})
				.catch((err) => {
					showErrorMsg('Cannot remove bug')
				})
		},
		setFilterBy(filterBy) {
            this.filterBy = { ...filterBy, pageIdx: 0 }
            console.log(this.filterBy)
            this.loadBugs()
        },
		setSortBy(sortBy) {
			this.sortBy = { ...sortBy }
			this.loadBugs()
		  },
		getPage(dir) {
            if(this.filterBy.pageIdx === 0 && dir === -1) return
            this.filterBy.pageIdx += dir
            this.loadBugs()
        },
		onDownloadPDF() {
			bugService.downloadPDF()
		}
	},
	computed: {
		
	},
	components: {
		BugFilter,
		BugList,
	},
}
