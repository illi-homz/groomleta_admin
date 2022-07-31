<template>
	<div class="g-groomers d-flex flex-column">
		<h1>Грумеры</h1>
		<v-row>
			<v-col class="d-flex justify-space-between">
				<v-text-field
					v-model="searchStr"
					append-icon="mdi-magnify"
					label="Поиск грумера"
					class="flex-grow-0"
					single-line
					hide-details
					color="#FFC11C"
				></v-text-field>
				<v-btn x-large color="#FFC11C" tile dark elevation="0" @click="createNewGroomer"
					>Создать нового грумера</v-btn
				>
			</v-col>
		</v-row>
		<v-row class="flex-grow-1">
			<v-col>
				<v-data-table
					:items-per-page="20"
					:headers="headers"
					:items="currentGroomersList"
					:search="search"
				>
					<template v-slot:item="{ item }">
						<tr @click="gotoDetail(item)" class="pointer">
							<td class="py-2">
								<v-img
									:src="item.image"
									width="32"
									height="32"
									style="border-radius: 50%"
								/>
							</td>
							<td class="text-xs-right py-2">
								{{ item.name }}
							</td>
							<td class="text-xs-right py-2">{{ item.phone }}</td>
							<td class="text-xs-right py-2">
								{{ item.experience }}
							</td>
						</tr>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getExperience } from '@/services/index';
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;

export default {
	name: 'GGroomers',
	data: () => ({
		searchStr: '',
		search: '',
		headers: [
			{
				text: 'Фото',
				align: 'start',
				sortable: false,
				value: 'image',
			},
			{ text: 'Имя Фамилия', value: 'name' },
			{ text: 'Телефон', value: 'phone' },
			{ text: 'Стаж', value: 'experience' },
		],
		desserts: [
			{
				name: 'Frozen Yogurt',
				calories: 159,
				fat: 6.0,
				carbs: 24,
				protein: 4.0,
				iron: '1%',
			},
		],
	}),
	computed: {
		...mapGetters(['GROOMERS']),
		currentGroomersList() {
			return this.GROOMERS.map(
				({ id, username, lastname, avatar, createDate, phone }) => {
					return {
						id: id,
						name: `${username} ${lastname}`,
						image: `${API_URL + MEDIAFILES}/${avatar}`,
						phone: phone,
						experience: getExperience(createDate),
					};
				},
			);
		},
	},
	mounted() {
		this.getAllGroomers();
	},
	methods: {
		...mapActions(['GET_ALL_GROOMERS']),
		async getAllGroomers() {
			const response = await this.GET_ALL_GROOMERS();
		},
		createNewGroomer() {
			console.log('createNewGroomer');
		},
		gotoDetail({ id }) {
			this.$router.push({ name: 'g-groomerdetail', params: { id } });
		},
	},
};
</script>

<style lang="scss">
.g-groomers {
}
</style>
