<template>
	<div class="g-color-selector">
		<v-btn
			v-for="color in data"
			:key="color"
			fab
			elevation="0"
			width="24"
			height="24"
			class="mr-2"
			@click="setColor({hex: color})"
		>
			<v-icon v-if="color === value" :color="color" size="28px">mdi-checkbox-blank-circle</v-icon>
			<v-icon v-else :color="color" size="28px">mdi-checkbox-blank-circle-outline</v-icon>
		</v-btn>
		<v-menu offset-y :close-on-content-click="false">
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					fab
					elevation="0"
					width="24"
					height="24"
					v-bind="attrs"
					v-on="on"
				>
					<v-img
						:src="require('@/assets/img/color-picker.png')"
						width="24"
						height="24"
					/>
				</v-btn>
			</template>
			<!-- v-model="color" -->
			<v-color-picker
				dot-size="25"
				hide-inputs
				swatches-max-height="200"
				@input="setColor"
			/>
		</v-menu>
	</div>
</template>

<script>
import { onPhoneInput } from '@/utils/phoneMask';

export default {
	name: 'GColorSelector',
	props: {
		data: {
			type: Array,
			default: () => ['#FFBE11'],
		},
		value: {
			type: String,
			default: '',
		},
	},
	data: () => ({}),
	mounted() {},
	methods: {
		onPhoneInput,
		setColor({ hex }) {
			this.$emit('input', hex);
		},
	},
};
</script>

<style lang="scss">
.g-color-selector {
}
</style>
