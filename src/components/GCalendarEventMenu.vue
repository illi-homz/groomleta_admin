<template>
	<div class="g-calendar-event-menu">
		<!-- v-model="value" -->
		<v-menu
			v-if="selectedEvent"
			@input="vModel"
			:value="value"
			:close-on-content-click="false"
			:activator="selectedElement"
			offset-y
		>
			<v-card color="grey lighten-4" min-width="350px" flat>
				<v-toolbar :color="selectedEvent.color" dark>
					<v-toolbar-title v-if="!isWritable">
						{{ selectedEvent.name }}
					</v-toolbar-title>
					<v-toolbar-title v-else>
						<v-text-field
							label="Название события"
							:value="selectedEvent.name"
							@input="name => setEvent({ name })"
							filled
							dense
							outlined
							color="#FFC11C"
							hide-details
						></v-text-field>
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn v-if="isWritable" icon @click="saveCanges">
						<v-icon>mdi-content-save-outline</v-icon>
					</v-btn>
					<v-btn icon @click="isWritable = !isWritable">
						<v-icon v-if="!isWritable">mdi-pencil</v-icon>
						<v-icon v-else>mdi-cancel</v-icon>
					</v-btn>
					<v-btn icon @click="closeEvent">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-card-text>
					<div>
						<div class="text-h6">Услуги:</div>
						<div v-if="!isWritable">
							<v-list-item
								v-for="service in selectedEvent.services"
								:key="service.id"
								dense
							>
								<v-list-item-content class="py-2">
									<v-list-item-title>{{
										service.title
									}}</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</div>
						<div v-else class="mb-2">
							<div>
								<v-list-item
									v-for="(
										service, idx
									) in selectedEvent.services"
									:key="service.id"
									class="px-0 pl-2"
									dense
								>
									<v-list-item-content class="py-2">
										<v-list-item-title>{{
											service.title
										}}</v-list-item-title>
									</v-list-item-content>
									<v-icon
										@click="removeService(idx)"
										color="#FFC11C"
										>mdi-close</v-icon
									>
								</v-list-item>
							</div>
							<v-autocomplete
								:items="
									servicesList.map((el, idx) => ({
										text: `${el.breed.title} - ${el.title}`,
										value: idx,
									}))
								"
								@change="setServices"
								v-model="services"
								color="#FFC11C"
								item-color="#FFC11C"
								:no-data-text="'Ничего не найдено'"
								placeholder="Услуги"
								hide-details
								outlined
								dense
								background-color="#FFF"
							/>
						</div>
					</div>
					<div v-if="selectedEvent.master">
						<span class="text-h6">Мастер:</span>
						<span class="ml-2">{{
							selectedEvent.master.username
						}}</span>
					</div>
					<div v-if="selectedEvent.client">
						<span class="text-h6">Клиент:</span>
						<span class="ml-2">{{
							selectedEvent.client.username
						}}</span>
					</div>
					<div>
						<span class="text-h6">Комментарий:</span>
						<div v-if="!isWritable" class="ml-2">
							{{ selectedEvent.comment }}
						</div>
						<!-- v-model="comment" -->
						<v-textarea
							v-else
							:value="selectedEvent.comment"
							@input="comment => setEvent({ comment })"
							label="Комментарий"
							color="#ddd"
							no-resize
							outlined
							background-color="#fff"
						></v-textarea>
					</div>
				</v-card-text>
				<v-card-actions>
					<v-btn text color="secondary" @click="closeEvent">
						Отмена
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-menu>
	</div>
</template>

<script>
export default {
	name: 'GCalendarEventMenu',
	props: ['selectedEvent', 'value', 'selectedElement', 'servicesList'],
	data: () => ({
		isWritable: false,
		services: '',
	}),
	watch: {
		value(v) {
			if (!v && this.isWritable) {
				this.isWritable = false;
			}
		},
	},
	methods: {
		vModel(v) {
			this.$emit('input', v);
		},
		closeEvent() {
			this.$emit('input', false);
		},
		setEvent(v) {
			this.$emit('setEvent', v);
		},
		saveCanges() {
			this.$emit('saveEvent');
		},
		setServices(idx) {
			const servicesIds = Array.from(
				new Set([
					...this.selectedEvent.services.map(el => el.id),
					this.servicesList[idx].id,
				]),
			);
			const services = servicesIds.map(id => {
				return this.servicesList.find(el => el.id === id);
			});
			this.setEvent({ services });
			this.services = '';
		},
		removeService(idx) {
			const services = this.selectedEvent.services?.filter(
				(el, i) => idx !== i,
			);
			this.setEvent({ services });
			this.services = '';
		},
	},
};
</script>

<style></style>
