export default function validator (form) {
	let formHasErrors = false
	let keys = Array.isArray(form) ? form : Object.keys(form)
	
	keys.forEach(f => {
		const isValid = this.$refs[f].validate(true);

		if (!isValid) {
			formHasErrors = true;
		}
	});

	return formHasErrors;
}