<template>
	<div class="g-feedbacks flex-grow-1 d-flex flex-column">
		<h1>Отзывы</h1>
		<div class="g-feedbacks-table flex-grow-1 d-flex flex-column">
			<v-data-table
				class="flex-grow-1"
				:items-per-page="15"
				:headers="headers"
				:items="FEEDBACKS"
				no-data-text="Ничего найти не получилось"
				no-results-text="Ничего найти не получилось"
				loading-text="Загрузка"
				:footer-props="{
					itemsPerPageText: 'Отзывов на странице',
					itemsPerPageAllText: 'Все',
					showCurrentPage: true,
					showFirstLastPage: true,
					pageText: `${currentPage} из ${pageCount}`,
				}"
				hide-default-footer
				@pagination="setCurrentPage"
			>
				<template v-slot:item="{ item }">
					<tr>
						<td class="text-left">
							<span>{{ item.nick }}</span>
						</td>
						<td class="text-left">
							<span>{{ item.text }}</span>
						</td>
						<td class="text-center">
							<div class="d-flex justify-center">
								<v-checkbox
									:input-value="item.isApproved"
									color="#FFC11C"
									hide-details
									class="mt-0"
									@change="v => changeFeedback(item.id, v)"
								/>
							</div>
						</td>
					</tr>
				</template>
				<template v-slot:footer="{ props: { options, pagination } }">
				<div class="v-data-footer__wrapper d-flex align-center pl-2">
					<div class="v-data-footer__info">
						Всего: {{FEEDBACKS.length}} {{declOfNum(FEEDBACKS.length, titles)}}
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
					/>
				</div>
			</template>
			</v-data-table>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { declOfNum } from '@/services';

export default {
	name: 'GFeedbacks',
	data: () => ({
		currentPage: 0,
		pageCount: 0,
		headers: [
			{ text: 'Имя Фамилия', value: 'nick', width: 300 },
			{ text: 'Коментарий', value: 'text' },
			{
				text: 'Одобрено',
				value: 'isApproved',
				width: 150,
				align: 'center',
			},
		],
		titles: ['отзыв', 'отзыва', 'отзывов']
	}),
	computed: {
		...mapGetters(['FEEDBACKS']),
	},
	mounted() {
		this.GET_ALL_FEEDBACKS();
	},
	methods: {
		...mapActions(['GET_ALL_FEEDBACKS', 'UPDATE_FEEDBACK']),
		declOfNum,
		async changeFeedback(id, isApproved) {
			const res = await this.UPDATE_FEEDBACK({id, data: {isApproved}})
			console.log('res', res)
		},
		setCurrentPage({ page, pageCount }) {
			this.currentPage = page;
			this.pageCount = pageCount;
		},
	},
};
</script>

<style lang="scss">
.g-feedbacks {
}
</style>
