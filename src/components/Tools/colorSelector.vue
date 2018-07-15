<template>
	<div id="color-selector">
		<chrome v-model="colors" @input="updateColor"></chrome>
		<!-- <button @click="changeColor">Change color</button> -->
	</div>
</template>

<script>
	import Chrome from './VueColor/components/Chrome.vue';
	export default {
		components: {
			Chrome,
		},
		data() {
			return {
				colors: {
					r: 0,
					g: 0,
					b: 0,
					a: 1,
				},
				unwatch: null
			};
		},
		methods: {
			updateColor() {
				this.$store.dispatch('setCurrentColor', this.colors);
			},
		},
		mounted() {
			this.unwatch = this.$store.watch(
				(state) => {
					return state.currentColor;
				},
				(newState, oldState) => {
					this.colors = { ...newState.rgba
					};
				}
			)
		},
		beforeDestroy() {
			this.unwatch();
		}
	};

</script>

<style lang="scss">
	@import "~vars";
	.color-preview-wrapper {
		width: 50%; // height: 100%;
		background-color: white;
		.color-preview {
			border: 1px solid #eee;
			padding-bottom: 100%;
		}
	}

	.control-wrapper {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		align-items: center;
	}

</style>
