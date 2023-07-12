export default {
	props: ['bug'],
	template: `
        <article class="bug-preview">
          <span>🐛</span>
          <h4>{{bug.title}}</h4>
          <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
          <!-- <div class="actions"> -->
            <!-- <RouterLink :to="'/bug/' + bug._id">Details</RouterLink> -->
            <!-- <RouterLink :to="'/bug/edit/' + bug._id"> Edit</RouterLink> -->
          <!-- </div> -->
          <!-- <button @click="onRemove(bug._id)">X</button> -->
          <h4>
              Owner: 
              <RouterLink :to="'/user/' + bug.owner._id">
                  {{bug.owner.fullname}}
              </RouterLink>
          </h4>
        </article>
`,
	methods: {
		// onRemove(bugId) {
    //   console.log(bugId);
		// 	this.$emit('removeBug', bugId)
		// },
	},
}
