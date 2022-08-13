<template>
	<div class="g-calendar-event-menu">
		<v-menu
			v-if="selectedEvent"
			:value="value"
			:close-on-content-click="false"
			:activator="selectedElement"
			offset-y
			offset-x
			@input="vModel"
		>
			<v-card color="grey lighten-4" min-width="350px" flat>
				<v-toolbar :color="selectedEvent.color" dark elevation="0">
					<v-toolbar-title
						v-if="!isWritable"
						class="flex-grow-1 mr-8"
					>
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
					<v-btn v-if="isWritable" icon @click="saveCanges">
						<v-icon>mdi-content-save-outline</v-icon>
					</v-btn>
					<GRemoveBtn
						v-if="!isWritable"
						@onRemoveEvent="
							$emit('onRemoveEvent', selectedEvent.id)
						"
					/>
					<v-btn
						v-if="!isWritable"
						icon
						@click="isWritable = !isWritable"
					>
						<v-icon>mdi-pencil</v-icon>
					</v-btn>
					<v-btn v-else icon @click="cancelEvent">
						<v-icon>mdi-cancel</v-icon>
					</v-btn>
					<v-btn icon @click="closeEvent">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-card-text>
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
									v-for="(
										service, idx
									) in selectedEvent.services"
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
								:value="
									selectedEvent.services?.map((_, i) => i)
								"
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
											text: `$${el.username} ${el.lastname}`,
											value: idx,
										};
									})
								"
								:value="
									groomersList?.findIndex(
										el =>
											el.id === selectedEvent.master?.id,
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
								{{ selectedEvent.client.username }}
							</div>
							<div v-else class="ml-2">Не выбран</div>
						</div>
						<div v-else class="mb-2">
							<v-autocomplete
								:items="
									clientsList?.map((el, idx) => {
										return {
											text: `$${el.username} ${el.lastname}`,
											value: idx,
										};
									})
								"
								:value="
									clientsList?.findIndex(
										el =>
											el.id === selectedEvent.client?.id,
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
						<span class="text-h6">Комментарий:</span>
						<div v-if="!isWritable" class="ml-2">
							{{ selectedEvent.comment }}
						</div>
						<v-textarea
							v-else
							:value="selectedEvent.comment"
							label="Комментарий"
							color="#ddd"
							class="mt-2"
							no-resize
							outlined
							background-color="#fff"
							@input="comment => setEvent({ comment })"
						/>
					</div>
				</v-card-text>
			</v-card>
		</v-menu>
	</div>
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
	},
};
</script>

<style></style>
