<template>
	<v-menu
		v-if="selectedEvent"
		:value="value"
		:close-on-content-click="false"
		:activator="selectedElement"
		offset-y
		@input="vModel"
	>
		<v-card
			color="grey lighten-4"
			class="g-calendar-event-menu ma-2"
			min-width="350px"
			flat
			elevation="2"
		>
			<v-toolbar
				:color="isSuccess ? 'grey darken-1' : selectedEvent.color"
				dark
				elevation="0"
			>
				<v-toolbar-title v-if="!isWritable" class="flex-grow-1 mr-8">
					{{ selectedEvent.name }}
				</v-toolbar-title>
				<v-toolbar-title v-else class="flex-grow-1 mr-8">
					<v-text-field
						:value="selectedEvent.name"
						filled
						dense
						rounded
						color="#FFC11C"
						background-color="#FFF"
						light
						hide-details
						@input="name => setEvent({ name })"
					/>
				</v-toolbar-title>
				<v-btn
					v-if="!isSuccess && !isWritable"
					class="mr-2"
					fab
					color="white"
					light
					height="40"
					width="40"
					elevation="0"
					@click="isWritable = !isWritable"
				>
					<v-icon>mdi-pencil</v-icon>
				</v-btn>
				<GRemoveBtn
					v-if="!isSuccess"
					@onRemoveEvent="$emit('onRemoveEvent', selectedEvent.id)"
				/>
			</v-toolbar>
			<v-card-text class="white">
				<div>
					<div class="text-h6">Услуги:</div>
					<div v-if="!isWritable">
						<ul v-if="selectedEvent.services?.length">
							<li
								v-for="service in selectedEvent.services"
								:key="service.id"
								class="pl-1"
							>
								{{ service.breed.title }} -
								{{ service.title }}
							</li>
						</ul>
						<div v-else class="px-2">
							<i>Услуги не выбраны</i>
						</div>
					</div>
					<div v-else class="mb-2">
						<div class="mb-1">
							<div
								v-for="(service, idx) in selectedEvent.services"
								:key="service.id"
								class="px-0 pl-2 d-flex"
							>
								<div class="flex-grow-1">
									{{ service.breed.title }} -
									{{ service.title }}
								</div>
								<v-icon
									color="#FFC11C"
									@click="removeService(idx)"
								>
									mdi-close
								</v-icon>
							</div>
						</div>
						<v-autocomplete
							:items="
								servicesList.map((el, idx) => ({
									text: `${el.breed.title} - ${el.title}`,
									value: idx,
								}))
							"
							:value="selectedEvent.services?.map((_, i) => i)"
							color="#FFC11C"
							item-color="#FFC11C"
							:no-data-text="'Ничего не найдено'"
							placeholder="Услуги"
							hide-details
							outlined
							dense
							background-color="#FFF"
							clearable
							multiple
							chips
							small-chips
							deletable-chips
							@change="setServices"
						/>
					</div>
				</div>
				<div>
					<span class="text-h6">Мастер:</span>
					<div v-if="!isWritable">
						<div v-if="selectedEvent.master" class="ml-2">
							{{ selectedEvent.master?.username }}
						</div>
						<div v-else class="ml-2">Не назначен</div>
					</div>
					<div v-else class="mb-2">
						<v-autocomplete
							:items="
								groomersList?.map((el, idx) => {
									return {
										text: `${el.username} ${el.lastname}`,
										value: idx,
									};
								})
							"
							:value="
								groomersList?.findIndex(
									el => el.id === selectedEvent.master?.id,
								)
							"
							color="#FFC11C"
							item-color="#FFC11C"
							:no-data-text="'Такого мастера нету'"
							clearable
							hide-details
							class="pt-0 mt-0"
							background-color="#FFF"
							outlined
							dense
							@change="setMaster"
						/>
					</div>
				</div>
				<div>
					<span class="text-h6">Клиент:</span>
					<div v-if="!isWritable">
						<div v-if="selectedEvent.client" class="ml-2">
							<router-link
								:to="{
									name: 'g-clientdetail',
									params: { id: selectedEvent.client.id },
								}"
							>
								{{ selectedEvent.client.username }}
								{{ selectedEvent.client.lastname }}<!-- -->
							</router-link>
							{{ ` - ${selectedEvent.client.phone}` }}
						</div>
						<div v-else class="ml-2">Не выбран</div>
					</div>
					<div v-else class="mb-2">
						<v-autocomplete
							:items="
								clientsList?.map((el, idx) => {
									return {
										text: `${el.username} ${el.lastname}`,
										value: idx,
									};
								})
							"
							:value="
								clientsList?.findIndex(
									el => el.id === selectedEvent.client?.id,
								)
							"
							color="#FFC11C"
							item-color="#FFC11C"
							:no-data-text="'Такого клиента нету'"
							hide-details
							class="pt-0 mt-0"
							background-color="#FFF"
							outlined
							clearable
							dense
							@change="setClient"
						/>
					</div>
				</div>
				<div>
					<span
						v-if="selectedEvent.comment || isWritable"
						class="text-h6"
					>
						Комментарий:
					</span>
					<div v-if="!isWritable" class="ml-2">
						{{ selectedEvent.comment }}
					</div>
					<v-textarea
						v-else
						:value="selectedEvent.comment"
						label="Комментарий"
						color="#ddd"
						class="mt-2"
						rows="2"
						hide-details
						no-resize
						outlined
						background-color="#fff"
						@input="comment => setEvent({ comment })"
					/>
				</div>
			</v-card-text>
			<v-card-actions>
				<div v-if="isWritable">
					<v-hover v-slot="{ hover }">
						<v-btn
							:color="hover ? 'black' : '#243138'"
							elevation="0"
							class="mr-2"
							:outlined="!hover"
							:dark="hover"
							tile
							@click="cancelEvent"
						>
							Отменить
						</v-btn>
					</v-hover>
					<v-hover v-slot="{ hover }">
						<v-btn
							:color="hover ? 'black' : '#243138'"
							elevation="0"
							:outlined="!hover"
							:dark="hover"
							tile
							@click="saveCanges"
						>
							Сохранить
						</v-btn>
					</v-hover>
				</div>
				<div v-if="!isWritable">
					<v-hover v-slot="{ hover }">
						<v-btn
							:color="hover ? 'black' : '#243138'"
							elevation="0"
							class="mr-2"
							:outlined="!hover"
							:dark="hover"
							tile
							@click="closeEvent"
						>
							Закрыть
						</v-btn>
					</v-hover>
					<v-hover v-if="!isSuccess" v-slot="{ hover }">
						<v-btn
							:color="hover ? 'black' : '#243138'"
							elevation="0"
							:outlined="!hover"
							:dark="hover"
							tile
							@click="toCreateOrder"
						>
							Оформить заказ
						</v-btn>
					</v-hover>
				</div>
			</v-card-actions>
		</v-card>
	</v-menu>
</template>

<script>
import GRemoveBtn from './GRemoveBtn.vue';

export default {
	name: 'GCalendarEventMenu',
	components: { GRemoveBtn },
	props: [
		'selectedEvent',
		'value',
		'selectedElement',
		'servicesList',
		'groomersList',
		'clientsList',
	],
	data: () => ({
		isWritable: false,
		selectedServices: '',
		oldEvent: null,
	}),
	computed: {
		isSuccess() {
			return this.selectedEvent.isSuccess;
		},
	},
	watch: {
		value(v) {
			if (!v && this.isWritable) {
				this.cancelEvent();
			}
		},
		selectedEvent(v) {
			this.oldEvent = JSON.parse(JSON.stringify(v));
		},
	},
	methods: {
		vModel(v) {
			this.$emit('input', v);
		},
		cancelEvent() {
			this.isWritable = false;

			if (this.oldEvent && this.selectedEvent.id) {
				this.setEvent(this.oldEvent);
			}
		},
		closeEvent() {
			this.cancelEvent();
			this.$emit('input', false);
		},
		setEvent(v) {
			this.$emit('setEvent', v);
		},
		saveCanges() {
			this.$emit('saveEvent');
			this.oldEvent = null;
			this.isWritable = false
		},
		setServices(srvcs) {
			const services = Array.isArray(srvcs)
				? srvcs.map(idx => {
						return this.servicesList[idx];
				  })
				: [this.servicesList[srvcs]];

			this.setEvent({ services });
		},
		removeService(idx) {
			const services = this.selectedEvent.services?.filter(
				(_, i) => idx !== i,
			);
			this.setEvent({ services });
		},
		setMaster(idx) {
			const master = this.groomersList[idx];
			this.setEvent({ master });
		},
		setClient(idx) {
			const client = this.clientsList[idx];
			this.setEvent({ client: client || '' });
		},
		toCreateOrder() {
			const { client, master, id, services } = this.selectedEvent;

			const data = {
				orderItems:
					services?.map(el => ({
						id: el.id,
						count: 1,
						type: 'service',
					})) || [],
				clientId: client?.id || '',
				masterId: master?.id || '',
				eventId: id,
			};

			this.$emit('toCreateOrder', data);
		},
	},
};
</script>

<style lang="scss">
.g-calendar-event-menu {
	.v-card__actions {
		background-color: #fff;
	}
}
</style>
