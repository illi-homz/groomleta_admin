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
			:items-per-page="itemsPerPage"
			:headers="headers"
			:items="currentGroomersList"
			:search="search"
			no-data-text="Ничего найти не получилось"
			no-results-text="Ничего найти не получилось"
			loading-text="Загрузка"
			hide-default-footer
			:page="currentPage"
			@pagination="setCurrentPage"
		>
			<template v-slot:item="{ item }">
				<tr class="pointer" @click="gotoDetail(item)">
					<td class="py-2">
						<v-img
							v-if="item.image"
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
			<template v-slot:footer="{ props: { options, pagination } }">
				<div class="v-data-footer__wrapper d-flex align-center pl-2">
					<div class="v-data-footer__info">
						Всего: {{currentGroomersList.length}} {{declOfNum(currentGroomersList.length, titles)}}
					</div>
					<v-data-footer
						class="flex-grow-1"
						:options="options"
						:pagination="pagination"
						items-per-page-text="Строк на странице:"
						items-per-page-all-text="Все"
						show-current-page
						show-first-last-page
						:page-text="`${currentPage} из ${pageCount}`"
						@update:options="footerUpdate"
					/>
				</div>
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
import { declOfNum } from '@/services';
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;

export default {
	name: 'GGroomers',
	components: { GCreateGroomerModalForm },
	data: () => ({
		currentPage: 0,
		pageCount: 0,
		itemsPerPage: 15,
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
		titles: ['грумер', 'грумера', 'грумеров'],
	}),
	computed: {
		...mapGetters(['GROOMERS']),
		currentGroomersList() {
			return this.GROOMERS.filter(({ isActive }) => {
				return isActive
			}).filter(
				el =>
					el.username
						.toLowerCase()
						.includes(this.searchStr.toLowerCase()) ||
					el.lastname
						.toLowerCase()
						.includes(this.searchStr.toLowerCase()) ||
					el.phone.includes(this.searchStr),
			).map(({ id, username, lastname, avatar, createDate, phone }) => {
				return {
					id: id,
					name: `${username} ${lastname}`,
					image: avatar ? `${API_URL + MEDIAFILES}/${avatar}` : '',
					phone: phone,
					experience: getExperience(createDate),
				};
			});
		},
	},
	mounted() {},
	methods: {
		...mapActions(['GET_ALL_GROOMERS', 'CREATE_MASTER']),
		declOfNum,
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
		footerUpdate({page, itemsPerPage}) {
			this.currentPage = page
			this.itemsPerPage = itemsPerPage
		},
	},
};
</script>

<style lang="scss">
.g-groomers {
}
</style>
