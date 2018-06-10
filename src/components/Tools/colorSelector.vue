<template>
	<div id="color-selector">
		<chrome v-model="colors" @input="updateColor"></chrome>
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
				hex: '#000000',
				hsl: {
					h: 0,
					s: 0,
					l: 0,
					a: 1,
				},
				hsv: {
					h: 0,
					s: 0,
					v: 0,
					a: 1,
				},
				rgba: {
					r: 0,
					g: 0,
					b: 0,
					a: 1,
				},
				a: 1,
			},
			currentColor: {
				r: 0,
				g: 0,
				b: 0,
				a: 255,
			},
		};
	},
	methods: {
		updateColor() {
			this.$store.dispatch('setCurrentColor', this.colors.rgba);
		},
	},
	computed: {
		colorToString: function() {
			return `rgba(${this.currentColor.r},${this.currentColor.g},${
				this.currentColor.b
			},${this.currentColor.a})`;
		},
	},
};
</script>

<style lang="scss">
@import '../../static/globals.scss';
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
