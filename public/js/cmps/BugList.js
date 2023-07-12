import BugPreview from './BugPreview.js'
import { userService } from '../services/user.service.js'


export default {
	props: ['bugs'],
	template: `
		<section v-if="bugs.length" class="bug-list">
            
            <ul>
                <li v-for="bug in bugs" :key="bug._id">
                    <BugPreview :bug="bug"/>
                    <RouterLink :to="'/bug/'+bug._id">Details</RouterLink> |
                    <RouterLink v-if="isOwner(bug)" :to="'/bug/edit/'+bug._id">Edit</RouterLink> |
                    <button v-if="isOwner(bug)" @click="remove(bug._id)">x</button>
                </li>
            </ul>
		</section>	
		<section v-else class="bug-list">Yay! No Bugs!</section>
        <!-- </section>
    	<ul v-if="bugs.length" class="bug-list">                    
      		<BugPreview v-for="bug in bugs" :bug="bug" :key="bug.id" @removeBug="$emit('remove', $event)" />
			<RouterLink :to="'/bug/'+bug._id">Details</RouterLink> |
            <RouterLink v-if="isOwner(bug)" :to="'/bug/edit/'+bug._id">Edit</RouterLink> |
    	    <button v-if="isOwner(bug)" @click="remove(bug._id)">x</button>
		</ul>
    	<section v-else class="bug-list">Yay! No Bugs!</section> -->
    `,
	 methods: {
        remove(bugId) {
            this.$emit('remove', bugId)
        },
        showDetails(bugId) {
            this.$emit('show-details', bugId)
        },
        isOwner(bug) {
            const user = userService.getLoggedinUser()
            if (!user) return false
            if (user.isAdmin) return true
            return bug.owner._id === user._id
        }
    },
	components: {
		BugPreview,
	},
}
