<template>
	<div class="g-clients flex-grow-1 d-flex flex-column">
		<h1 class="mb-4">Клиенты</h1>
		<v-divider class="mb-5" />
		<v-row class="flex-grow-0 my-0 mb-5">
			<v-col cols="3" class="py-0 d-flex align-end">
				<v-text-field
					v-model="searchStr"
					prepend-inner-icon="mdi-magnify"
					label="Поиск клиента"
					single-line
					hide-details
					color="#FFC11C"
					filled
					dense
				/>
			</v-col>
			<v-col class="d-flex">
				<v-spacer />
				<v-btn
					x-large
					color="#FFC11C"
					tile
					dark
					elevation="0"
					@click="createClient"
				>
					<!-- @click="isFormActive = true" -->
					<v-icon>mdi-plus</v-icon>
					Создать нового клиента
				</v-btn>
				<!-- <v-btn
					x-large
					color="#666"
					class="ml-4"
					tile
					outlined
					elevation="0"
					@click="createClient"
				>
					<v-icon>mdi-plus</v-icon>
					New
				</v-btn> -->
			</v-col>
		</v-row>
		<v-data-table
			class="flex-grow-1"
			:items-per-page="15"
			:headers="headers"
			:items="currentClients"
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
			@pageCount="setPageCount"
		>
			<template v-slot:item="{ item }">
				<tr
					v-if="+writableClientId !== +item.id || !selectedClient"
					class="pointer"
					@click="goToClientDetail(item.id)"
					@contextmenu.prevent="writeClient(item.id)"
				>
					<td
						v-for="key in [
							'username',
							'lastname',
							'phone',
							'animal',
						]"
						:key="key"
						class="text-xs-right py-2"
					>
						<span>{{ item[key] }}</span>
					</td>
					<td class="text-xs-right py-2">
						<div class="flex-grow-1">
							{{ item.comment }}
						</div>
					</td>
					<td class="text-center">
						<v-spacer />
						<v-hover v-slot="{ hover }">
							<v-icon
								class="mr-5"
								:color="hover ? '#FFC11C' : 'gray'"
								@click="writeClient(item.id)"
							>
								mdi-pencil-outline
							</v-icon>
						</v-hover>
						<v-hover v-slot="{ hover }">
							<v-icon
								:color="hover ? 'red' : 'gray'"
								@click="removeClient(item.id)"
							>
								mdi-trash-can-outline
							</v-icon>
						</v-hover>
						<v-spacer />
					</td>
				</tr>

				<tr v-else @click="goToClientDetail(item.id)">
					<td
						v-for="key in ['username', 'lastname']"
						:key="key"
						class="g-clients__td text-xs-right py-2"
					>
						<v-text-field
							v-model="selectedClient[key]"
							filled
							dense
							color="#FFC11C"
							light
							hide-details
						/>
					</td>
					<td class="g-clients__td text-xs-right py-2">
						<v-text-field
							:value="selectedClient.phone"
							filled
							dense
							color="#FFC11C"
							class="data-tel-input"
							light
							hide-details
							@input="setPhone"
						/>
					</td>
					<td class="g-clients__td text-xs-right py-2">
						<v-text-field
							v-model="selectedClient.animal"
							filled
							dense
							color="#FFC11C"
							light
							hide-details
						/>
					</td>
					<td class="g-clients__td text-xs-right py-2">
						<div class="d-flex align-center">
							<v-textarea
								v-model="selectedClient.comment"
								class="lex-grow-1"
								filled
								color="#FFC11C"
								light
								hide-details
								rows="2"
							/>
						</div>
						<!-- <div class="py-2 d-flex">
									<v-btn
										elevation="0"
										class="flex-grow-1 mr-4"
										x-large
										@click="cancelWritingClient"
										>Отменить</v-btn
									>
									<v-btn
										elevation="0"
										class="flex-grow-1"
										x-large
										color="#FFC11C"
										tile
										dark
										@click="saveClient"
										>Сохранить</v-btn
									>
								</div> -->
					</td>
					<td class="py-2">
						<v-btn
							elevation="0"
							class="mb-2"
							style="width: 100%"
							x-large
							@click="cancelWritingClient"
						>
							Отменить
						</v-btn>
						<v-btn
							elevation="0"
							class="d-block"
							style="width: 100%"
							x-large
							color="#FFC11C"
							tile
							dark
							@click="saveClient"
						>
							Сохранить
						</v-btn>
					</td>
				</tr>
			</template>
		</v-data-table>
		<v-dialog v-model="removeDialog" persistent max-width="290">
			<v-card>
				<v-card-title class="text-h5"> Удалить клиента? </v-card-title>
				<v-card-text>
					После удаления данные будут недоступны
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn color="#FFC11C" text @click="cancelRemoveClient">
						Отмена
					</v-btn>
					<v-btn
						color="red darken-1"
						text
						@click="confirmedRemoveClient"
					>
						Удалить
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<GCreateClientModalForm
			:is-avtive="isFormActive"
			@onModalClose="isFormActive = false"
			@onSubmitEvent="submitForm"
		/>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import { onPhoneInput } from '@/utils/phoneMask';
import { GCreateClientModalForm } from '@/components';

const defaultClient = {
	id: -1,
	username: '',
	lastname: '',
	phone: '+7',
	comment: '',
	animal: '',
};

export default {
	name: 'GClients',
	components: { GCreateClientModalForm },
	data: () => ({
		currentPage: 0,
		pageCount: 0,
		searchStr: '',
		search: '',
		removeDialog: false,
		headers: [
			{ text: 'Имя', value: 'username', width: 300 },
			{ text: 'Фамилия', value: 'lastname', width: 300 },
			{ text: 'Телефон', value: 'phone', width: 230 },
			{ text: 'Животное', value: 'animal', width: 300 },
			{ text: 'Комментарий', value: 'comment' },
			{
				text: 'Действия',
				value: 'actions',
				sortable: false,
				align: 'center',
				width: 200,
			},
		],
		clients: [],
		writableClientId: null,
		selectedClient: null,
		oldClients: null,
		oldClient: null,
		removedClientId: null,
		isFormActive: false,
	}),
	computed: {
		currentClients() {
			return this.clients.filter(
				el =>
					el.username.includes(this.searchStr) ||
					el.lastname.includes(this.searchStr) ||
					el.phone.includes(this.searchStr),
			);
		},
	},
	mounted() {
		this.getClients();
	},
	methods: {
		...mapActions([
			'GET_ALL_CLIENTS',
			'CREATE_CLIENT',
			'UPDATE_CLIENT',
			'REMOVE_CLIENT',
		]),
		async getClients() {
			const { data } = await this.GET_ALL_CLIENTS();
			this.clients = data;
		},
		createClient() {
			this.cancelWritingClient();

			this.oldClients = JSON.parse(JSON.stringify(this.clients));
			this.clients = [{ ...defaultClient }, ...this.clients];
			this.writableClientId = -1;
			this.selectedClient = this.clients[0];
		},
		async submitForm(form) {
			const {
				data: { allClients },
			} = await this.CREATE_CLIENT(form);

			this.clients = allClients;
		},
		async saveClient() {
			if (!this.selectedClient?.username) return;

			const client = this.selectedClient;

			if (client.id === -1) {
				const data = {
					username: client.username?.trim(),
					lastname: client.lastname?.trim() || '',
					phone: client.phone?.trim() || '',
					comment: client.comment?.trim() || '',
					animal: client.animal?.trim() || '',
				};

				const {
					data: { allClients },
				} = await this.CREATE_CLIENT(data);
				this.clients = allClients;
				this.selectedClient = null;
				this.writableClientId = null;
				this.oldClients = null;
			} else {
				const data = {};

				if (this.oldClient.username !== client.username)
					data.username = client.username.trim();
				if (this.oldClient.lastname !== client.lastname)
					data.lastname = client.lastname.trim();
				if (this.oldClient.phone !== client.phone)
					data.phone = client.phone.trim();
				if (this.oldClient.animal !== client.animal)
					data.animal = client.animal.trim();
				if (this.oldClient.comment !== client.comment)
					data.comment = client.comment.trim();

				if (!Object.keys(data).length) {
					return this.cancelWritingClient();
				}

				const {
					data: { allClients },
				} = await this.UPDATE_CLIENT({ id: client.id, data });
				this.clients = allClients;
				this.selectedClient = null;
				this.writableClientId = null;
				this.oldClients = null;
			}
		},
		setPageCount(v) {
			this.pageCount = v;
		},
		setCurrentPage({ page }) {
			this.currentPage = page;
		},
		writeClient(id) {
			this.cancelWritingClient();

			this.writableClientId = id;
			this.selectedClient = this.clients.find(el => +el.id === +id);
			this.oldClient = { ...this.selectedClient };
		},
		cancelWritingClient() {
			if (this.oldClients) {
				this.clients = [...this.oldClients];
				this.oldClients = null;
			}

			if (this.oldClient) {
				this.clients = [...this.clients].map(el => {
					if (el.id === this.writableClientId) {
						return { ...this.oldClient };
					}

					return el;
				});
				this.oldClient = null;
			}

			this.selectedClient = null;
			this.writableClientId = null;
		},
		removeClient(id) {
			this.removedClientId = id;
			this.removeDialog = true;
		},
		cancelRemoveClient() {
			this.removedClientId = null;
			this.removeDialog = false;
		},
		async confirmedRemoveClient() {
			if (this.removedClientId) {
				const {
					data: { allClients },
				} = await this.REMOVE_CLIENT(this.removedClientId);

				this.clients = allClients;
			}

			this.removedClientId = null;
			this.removeDialog = false;
		},
		setPhone(v) {
			this.selectedClient.phone = onPhoneInput(v);
		},
		goToClientDetail(id) {
			console.log('goToClientDetail', id);
		},
	},
};
</script>

<style lang="scss">
.g-clients {
	&__td {
		height: auto !important;
		vertical-align: top;
	}
}
</style>
