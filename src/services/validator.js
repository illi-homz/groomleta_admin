export default function validator (form) {
	let formHasErrors = false
	
	Object.keys(form).forEach(f => {
		const isValid = this.$refs[f].validate(true);
		console.log('isValid')

		if (!isValid) {
			formHasErrors = true;
		}
	});

	return formHasErrors;
}