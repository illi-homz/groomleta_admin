<template>
	<div class="g-client-detail d-flex flex-column flex-grow-1">
		<div
			v-if="isLoading"
			class="d-flex align-center flex-grow-1 justify-center"
		>
			<v-progress-circular
				:size="60"
				:width="5"
				color="amber"
				indeterminate
			/>
		</div>
		<div v-else class="flex-grow-1 d-flex flex-column">
			<v-breadcrumbs :items="breadcrumbs">
				<template v-slot:divider>
					<v-icon>mdi-chevron-right</v-icon>
				</template>
			</v-breadcrumbs>
			<div class="d-flex align-top">
				<h1
					class="mb-6 flex-grow-1"
					:class="{ 'red--text text--accent-3': client.isBlocked }"
				>
					{{ client.username }} {{ client.lastname }}
				</h1>
				<v-btn
					color="error"
					elevation="0"
					tile
					small
					@click="putToBlock"
				>
					В блок
				</v-btn>
			</div>
			<v-tabs color="grey darken-1" class="flex-grow-0">
				<v-tab @click="tableType = 'data'">Данные клиента</v-tab>
				<v-tab @click="tableType = 'orders'">Заказы</v-tab>
			</v-tabs>
			<div
				v-if="tableType === 'data' && !!orders"
				class="flex-grow-1 mt-6"
			>
				<v-row>
					<v-col cols="4">
						<v-text-field
							v-model="client.lastname"
							class="text-body-1"
							label="Фамилия"
							filled
							color="rgba(36, 49, 56, 0.38)"
							light
							hide-details
						/>
					</v-col>
					<v-col cols="4">
						<v-text-field
							v-model="client.address"
							class="text-body-1"
							label="Адрес"
							filled
							color="rgba(36, 49, 56, 0.38)"
							light
							hide-details
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="4">
						<v-text-field
							v-model="client.username"
							class="text-body-1"
							label="Имя"
							filled
							color="rgba(36, 49, 56, 0.38)"
							light
							hide-details
						/>
					</v-col>
					<v-col cols="4">
						<v-text-field
							v-model="client.animal"
							class="text-body-1"
							label="Порода питомца"
							filled
							color="rgba(36, 49, 56, 0.38)"
							light
							hide-details
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="4">
						<v-text-field
							:value="client.phone"
							class="text-body-1"
							label="Телефон"
							color="rgba(36, 49, 56, 0.38)"
							light
							filled
							hide-details
							@input="setPhone"
						/>
					</v-col>
					<v-col cols="4">
						<!-- <v-text-field
							v-model="client.animal"
							class="text-body-1"
							label="Порода питомца"
							filled
							color="rgba(36, 49, 56, 0.38)"
							light
							hide-details
						/> -->
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="8">
						<div class="g-client-detail__textarea-wrapper pa-2">
							<v-textarea
								v-model="client.comment"
								label="Заметки"
								color="rgba(36, 49, 56, 0.38)"
								counter="100"
								no-resize
								rows="6"
							/>
						</div>
					</v-col>
				</v-row>
				<v-btn
					v-if="isChanged"
					class="mt-4"
					color="#FFC11C"
					tile
					dark
					elevation="0"
					@click="successUpdates"
				>
					Сохранить изменения
				</v-btn>
				<v-btn
					v-if="isChanged"
					class="mt-4 ml-2"
					color="grey lighten-3"
					tile
					light
					elevation="0"
					@click="client = { ...oldClient }"
				>
					Отменить изменения
				</v-btn>
			</div>
			<GDetailPageOrdersTable
				v-if="tableType === 'orders' && !!orders"
				:orders="orders"
				:items-per-page="itemsPerPage"
				:items-length="itemsLength"
				:current-page="currentPage"
				:page-count="pageCount"
				class="flex-grow-1"
				@onLineClick="showOrderModal"
				@setCurrentPage="setCurrentPage"
				@setItemsPerPage="setItemsPerPage"
				@updateData="getData"
			/>
		</div>
	</div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { GDetailPageOrdersTable } from '@/components';
import { onPhoneInput } from '@/utils/phoneMask';

export default {
	name: 'GClientDetail',
	components: { GDetailPageOrdersTable },
	data: () => ({
		client: null,
		oldClient: null,
		orders: null,
		isLoading: true,
		tableType: 'data',
		currentPage: 1,
		pageCount: 0,
		itemsPerPage: 15,
		itemsLength: 0,
	}),
	computed: {
		breadcrumbs() {
			if (!this.client) return [];

			const { username, lastname } = this.client;

			return [
				{
					text: 'Клиенты',
					disabled: false,
					// href: '/clients',
					to: { name: 'g-clients' },
				},
				{
					text: `${username} ${lastname}`,
					disabled: true,
				},
			];
		},
		isChanged() {
			return !Object.keys(this.oldClient).every(key => {
				return this.oldClient[key] === this.client[key];
			});
		},
		pagination() {
			return {
				page: this.currentPage,
				itemsPerPage: this.itemsPerPage,
				pageStart: 0,
				pageStop:
					this.itemsLength - this.currentPage * this.itemsPerPage,
				pageCount: this.pageCount,
				itemsLength: this.itemsLength,
			};
		},
	},
	mounted() {
		this.getData();
	},
	methods: {
		...mapActions(['GET_CLIENT_BY_ID', 'UPDATE_CLIENT', 'PUT_TO_BLOCK']),
		...mapMutations(['SHOW_ORDER_DETAIL_SHIELD']),

		async getData() {
			const id = this.$route.params.id;

			const { data } = await this.GET_CLIENT_BY_ID({
				id,
				ordersPage: this.currentPage,
				ordersPerPage: this.itemsPerPage,
			});
			const { client, allOrders, orders, ordersSize, ordersPagesSize } = data || {};

			this.client = JSON.parse(JSON.stringify(client));
			this.oldClient = client;
			// this.orders = allOrders;
			this.isLoading = false;

			this.pageCount = ordersPagesSize;
			this.itemsLength = ordersSize;
			this.orders = orders
		},
		async successUpdates() {
			const id = this.$route.params.id;

			const formData = {};

			Object.keys(this.oldClient).forEach(key => {
				if (this.oldClient[key] !== this.client[key]) {
					formData[key] = this.client[key];
				}
			});

			const { data } = await this.UPDATE_CLIENT({ id, data: formData });
			const { client } = data || {};

			if (!client) {
				this.$router.push({ name: 'g-clients' });

				return;
			}

			this.client = JSON.parse(JSON.stringify(client));
			this.oldClient = client;
		},
		showOrderModal(item) {
			this.SHOW_ORDER_DETAIL_SHIELD(item);
		},
		setPhone(v) {
			const value = onPhoneInput(v);

			if (this.client.phone === value) {
				this.client.phone = v;
			}

			setTimeout(() => (this.client.phone = value), 0);
		},
		async putToBlock() {
			const id = this.$route.params.id;
			await this.PUT_TO_BLOCK(id);
			this.getData()
		},
		setCurrentPage(page) {
			this.currentPage = page
		},
		setItemsPerPage(count) {
			this.itemsPerPage = count
		}
	},
};
</script>

<style lang="scss">
.g-client-detail {
	.v-input {
		&__slot {
			&::after {
				display: none;
			}
		}
	}
	.v-input {
		&__slot {
			&::before {
				display: none;
			}
		}
	}

	&__textarea-wrapper {
		border: 1px solid rgba(36, 49, 56, 0.2);
	}
}
</style>
