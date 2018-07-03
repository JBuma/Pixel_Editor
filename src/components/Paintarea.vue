<template>
	<section id="paint-area">
		<pixel-canvas id='pixel-canvas' :canvas-dimensions="canvasDimensions"></pixel-canvas>
	</section>
</template>

<script>
	import pixelCanvas from "./PixelCanvas.vue";
	export default {
		components: {
			pixelCanvas
		},
		data() {
			return {
				canvasDimensions: {
					x: 500,
					y: 500,
				},
			};
		},
		computed: {
			dimensionsToStyle: function () {
				return `width:${this.canvasDimensions.x}px;height:${this.canvasDimensions.y}px;`
			},
		},
		methods: {
			handleScroll(e) {
				//TODO: scale zoom speed depending on size
				this.canvasDimensions.x -= e.deltaY * this.$store.state.settings.zoomSensitivity;
				this.canvasDimensions.y -= e.deltaY * this.$store.state.settings.zoomSensitivity;
				if (this.canvasDimensions.x < 30) this.canvasDimensions.x = 30;
				if (this.canvasDimensions.y < 30) this.canvasDimensions.y = 30;
			},
		},
		mounted() {
			document.getElementById("paint-area").addEventListener('wheel', (e) => this.handleScroll(e));
		},
		beforeDestroy() {
			document.getElementById('paint-area').removeEventListener('wheel', this.handleScroll);
		},
	};

</script>

<style lang="scss">
	@import '../static/globals.scss';
	#paint-area {
		position: relative;
		flex-grow: 1;
		float: left;
		background-color: #445;
		height: 100%;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		max-width: 80vw;
		max-height: 100%;
	}

	#pixel-canvas {
		position: absolute;
		transform: translate(0px, 0px);
		transform-origin: center center;
	}

</style>
