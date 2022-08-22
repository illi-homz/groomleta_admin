<template>
	<div class="g-groomers d-flex flex-column flex-grow-1">
		<h1 class="mb-4">Грумеры</h1>
		<v-divider class="mb-5" />
		<v-row class="flex-grow-0 my-0 mb-5">
			<v-col cols="3" class="py-0 d-flex align-end">
				<v-text-field
					v-model="searchStr"
					prepend-inner-icon="mdi-magnify"
					label="Поиск заказа"
					single-line
					hide-details
					color="#FFC11C"
					filled
					dense
				/>
			</v-col>
			<v-col class="d-flex py-0">
				<v-spacer />
				<v-btn
					x-large
					color="#FFC11C"
					tile
					dark
					elevation="0"
					@click="isFormActive = true"
				>
					<v-icon>mdi-plus</v-icon>
					Создать нового грумера
				</v-btn>
			</v-col>
		</v-row>
		<v-data-table
			class="flex-grow-1"
			:items-per-page="10"
			:headers="headers"
			:items="currentGroomersList"
			:search="search"
			no-data-text="Ничего найти не получилось"
			no-results-text="Ничего найти не получилось"
			loading-text="Загрузка"
			:footer-props="{
				itemsPerPageText: 'Мастеров на странице',
				itemsPerPageAllText: 'Все',
				showCurrentPage: true,
				showFirstLastPage: true,
				pageText: `${currentPage} из ${pageCount}`,
			}"
			@pagination="setCurrentPage"
		>
			<template v-slot:item="{ item }">
				<tr class="pointer" @click="gotoDetail(item)">
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
		<GCreateGroomerModalForm
			:is-avtive="isFormActive"
			@onModalClose="isFormActive = false"
			@onSubmit="createNewGroomer"
		/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getExperience } from '@/services/index';
import { GCreateGroomerModalForm } from '@/components';
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;

export default {
	name: 'GGroomers',
	components: { GCreateGroomerModalForm },
	data: () => ({
		currentPage: 0,
		pageCount: 0,
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
		isFormActive: false,
	}),
	computed: {
		...mapGetters(['GROOMERS']),
		currentGroomersList() {
			return this.GROOMERS.filter(
				el =>
					el.username.includes(this.searchStr) ||
					el.lastname.includes(this.searchStr) ||
					el.phone.includes(this.searchStr),
			).map(({ id, username, lastname, avatar, createDate, phone }) => {
				return {
					id: id,
					name: `${username} ${lastname}`,
					image: `${API_URL + MEDIAFILES}/${avatar}`,
					phone: phone,
					experience: getExperience(createDate),
				};
			});
		},
	},
	mounted() {},
	methods: {
		...mapActions(['GET_ALL_GROOMERS', 'CREATE_MASTER']),
		setCurrentPage({ page, pageCount }) {
			this.currentPage = page;
			this.pageCount = pageCount;
		},
		async createNewGroomer(form) {
			const { data } = await this.CREATE_MASTER(form);
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
