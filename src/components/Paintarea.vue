<template>
	<section @mousedown.middle="beginDragCanvas($event)" @mouseleave="stopDragCanvas($event)" @mouseup.middle="stopDragCanvas($event)"
	    id="paint-area">
		<div id="canvas-cover" style="width:100%;height:100%;"></div>
		<pixel-canvas @mousedown.middle="beginDragCanvas($event)" @mouseleave="stopDragCanvas($event)" @mouseup="stopDragCanvas($event)"
		    id='pixel-canvas' :temp-canvas-dimensions="canvasDimensions" :style="transformStyle"></pixel-canvas>
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
				canvasPosition: {
					x: 0,
					y: 0
				},
				isDragging: false,
				prevMousePosition: {
					x: null,
					y: null
				}
			};
		},
		computed: {
			transformStyle: function () {
				return `transform:translate(${this.canvasPosition.x}px,${this.canvasPosition.y}px);`
			}
		},
		methods: {
			handleScroll(e) {
				//TODO: scale zoom speed depending on size
				this.canvasDimensions.x -= e.deltaY * this.$store.state.settings.zoomSensitivity;
				this.canvasDimensions.y -= e.deltaY * this.$store.state.settings.zoomSensitivity;
				if (this.canvasDimensions.x < 30) this.canvasDimensions.x = 30;
				if (this.canvasDimensions.y < 30) this.canvasDimensions.y = 30;
			},
			beginDragCanvas(e) {
				this.isDragging = true;
				this.prevMousePosition.x = e.clientX;
				this.prevMousePosition.y = e.clientY;
				// console.log(e);
			},
			dragCanvas(e) {
				if (this.isDragging) {
					this.canvasPosition.x += e.clientX - this.prevMousePosition.x;
					this.canvasPosition.y += e.clientY - this.prevMousePosition.y;
					this.prevMousePosition.x = e.clientX;
					this.prevMousePosition.y = e.clientY;
					// console.log(this.canvasPosition.x);
				}
			},
			stopDragCanvas(e) {
				this.isDragging = false;
				// console.log(e);
			}
		},
		mounted() {
			document.getElementById("paint-area").addEventListener('wheel', (e) => this.handleScroll(e));
			document.getElementById('canvas-cover').addEventListener("mousemove", (e) => {
				this.dragCanvas(e);
			});
			document.getElementById('pixel-canvas').addEventListener("mousemove", (e) => {
				this.dragCanvas(e);
			});
		},
		beforeDestroy() {
			document.getElementById("paint-area").removeEventListener('wheel', (e) => this.handleScroll(e));
			document.getElementById('canvas-cover').removeEventListener("mousemove", (e) => {
				this.dragCanvas(e);
			});
			document.getElementById('pixel-canvas').removeEventListener("mousemove", (e) => {
				this.dragCanvas(e);
			});
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
		position: absolute; // transform: translate(0px, 0px);
		transform-origin: center center;
	}

</style>
