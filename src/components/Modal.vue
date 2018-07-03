<template>
	<transition name="modal-fade">
		<div v-if="isOpen" class="modal-background">
			<div class="modal">
				<!-- <slot name="modal"> -->
				<div class="modal-header">
					<button @click="closeModal" class="light icon borderless close-modal">
						<i class="icon times large"></i>
					</button>
				</div>
				<div class="content">
					<slot name="modal-content"></slot>
				</div>
				<div class="controls">
					<slot name="modal-controls"></slot>
					<button v-if="canCancel" class="close-modal primary" @click="closeModal">Cancel</button>
				</div>
				<!-- </slot> -->
			</div>
		</div>
	</transition>

</template>

<script>
	export default {
		props: {
			canCancel: {
				// type: Boolean,
				default: true,
			},
			width: {
				// type: Number,
				default: 200
			},
			height: {
				// type: Number,
				default: 200
			}
		},
		data() {
			return {
				type: {

				},
				isOpen: false
			}
		},
		methods: {
			toggleModal() {
				this.isOpen = !this.isOpen;
			},
			openModal() {
				this.isOpen = true;
			},
			closeModal() {
				this.isOpen = false;
			}
		}
	}

</script>
<style lang="scss">
	@import "~vars";
	.modal-background {
		position: absolute;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;
	}

	.modal {
		z-index: 10;
		min-width: 30%;
		max-width: 80%;
		min-height: 30%;
		max-height: 80%;
		padding: $spacing--medium;

		background-color: $background--dark-pressed;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		.content {
			flex-grow: 1;
		}
		.controls {
			width: 100%;
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-end;
		}
		.modal-header {
			display: flex;
			flex-direction: row-reverse;
		}
	}

	.modal-fade-enter,
	.modal-fade-leave-active {
		opacity: 0;
	}

	.modal-fade-enter-active,
	.modal-fade-leave-active {
		transition: opacity 0.3s ease;
	}

</style>
