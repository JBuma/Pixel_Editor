<template>
	<div class="canvas-wrapper">
		<canvas ref="canvas" id="canvas" :width="this.$store.state.settings.imageDimensions.x" :height="this.$store.state.settings.imageDimensions.y"
		    :style="dimensionsToStyle">
		</canvas>
		<div ref="canvas-grid" id="canvas-grid" :width="canvasDimensions.x" :height="canvasDimensions.y" @mousedown.left="onMouseDown($event)"
		    @mousemove="onMouseMove($event)" @mouseup.left="onMouseUp($event)" @mouseleave="onMouseUp($event)" :style="dimensionsToStyle">
			<!-- Blocks clicking/dragging the grid -->
			<div id="image-blocker" style="width:100%;height:100%;z-index:2;position:absolute;"></div>
			<!-- Grid -->
			<svg :style="dimensionsToStyle+'z-index:1;'" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern id="smallGrid" :width="gridSize.x" :height="gridSize.y" patternUnits="userSpaceOnUse">
						<path :d="smallGridPath" fill="none" stroke="rgba(150,150,150,0.75)" stroke-width="1" />
					</pattern>
					<pattern id="grid" :width="gridSize.x*8" :height="gridSize.y*8" patternUnits="userSpaceOnUse">
						<rect :width="gridSize.x*8" :height="gridSize.y*8" fill="url(#smallGrid)" />
						<path :d="largeGridPath" fill="none" stroke="gray" stroke-width="2" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" :fill="isGridActive" stroke="rgb(0,0,0)" stroke-width="4" />
			</svg>
		</div>
	</div>
</template>

<script>
	import {
		eventBus
	} from "./eventBus.js";
	import {
		mapGetters
	} from 'vuex';

	export default {
		data() {
			return {
				unwatch: null,
				imageCanvas: null,
				ctx: null,
				imageDimensions: {
					x: 16,
					y: 16,
				},
				exportDimensions: {
					x: 128,
					y: 128,
				},
				gridSize: {
					x: 16,
					y: 16
				},
				dataURI: null,
				canvasDimensions: {
					x: 500,
					y: 500
				}
			};
		},
		props: {
			tempCanvasDimensions: {
				type: Object,
				default: function () {
					return {
						x: 500,
						y: 500
					}
				}
			}
		},
		computed: {
			dimensionsToStyle: function () {
				return `width:${this.canvasDimensions.x}px;height:${this.canvasDimensions.y}px;`
			},
			smallGridPath: function () {
				return `M ${this.gridSize.x} 0 L 0 0 0 ${this.gridSize.y}`;
			},
			largeGridPath: function () {
				return `M ${this.gridSize.x*10} 0 L 0 0 0 ${this.gridSize.y*10}`
			},
			isGridActive: function () {
				return this.$store.state.settings.gridActive ? 'url(#grid)' : 'none';
			},
		},
		methods: {
			updateImage() {
				let idata = this.ctx.createImageData(
					this.$store.state.settings.imageDimensions.x,
					this.$store.state.settings.imageDimensions.y,
				);
				idata.data.set(this.$store.state.imageBuffer);
				this.ctx.putImageData(idata, 0, 0);
			},
			onMouseDown(e) {
				// e.stopPropagation();
				if (this.$store.state.currentTool.onMouseDown) {
					let pos = this.getPosition(e.layerX, e.layerY);
					this.$store.state.currentTool.onMouseDown(pos);
				}
				this.updateImage();
			},
			onMouseMove(e) {
				// e.stopPropagation();
				if (this.$store.state.currentTool.onMouseMove) {
					let pos = this.getPosition(e.layerX, e.layerY);
					this.$store.state.currentTool.onMouseMove(pos);
				}
				this.updateImage();
			},
			onMouseUp(e) {
				if (this.$store.state.currentTool.onMouseUp) {
					let pos = this.getPosition(e.layerX, e.layerY);
					this.$store.state.currentTool.onMouseUp(e, pos);
				}
				this.updateImage();
			},
			getPosition(x, y) {
				let pos = {
					gridX: 0,
					gridY: 0,
					bufferPos: 0
				};
				pos.gridX = Math.floor(
					x / (this.canvasDimensions.x / this.$store.state.settings.imageDimensions.x),
				);
				pos.gridY = Math.floor(
					y / (this.canvasDimensions.y / this.$store.state.settings.imageDimensions.y),
				);
				pos.bufferPos = (pos.gridY * this.$store.state.settings.imageDimensions.x + pos.gridX) * 4;
				return pos;
			},
			createBuffer() {
				this.tempBuffer = new Uint8ClampedArray(
					this.$store.state.settings.imageDimensions.x * this.$store.state.settings.imageDimensions.y * 4,
				);
				for (var y = 0; y < this.$store.state.settings.imageDimensions.y; y++) {
					for (var x = 0; x < this.$store.state.settings.imageDimensions.x; x++) {
						var pos = (y * this.$store.state.settings.imageDimensions.x + x) * 4; // position in buffer based on x and y
						this.tempBuffer[pos] = 0; // red value
						this.tempBuffer[pos + 1] = 0; // green value
						this.tempBuffer[pos + 2] = 0; // blue value
						this.tempBuffer[pos + 3] = 0; // alpha value (0,100)
					}
				}
				this.$store.dispatch('setBuffer', this.tempBuffer);
			},
			newCanvas() {
				this.createBuffer();
				this.updateImage();
				this.createNewDimensions(this.tempCanvasDimensions);
			},
			createNewDimensions(newDimensions) {
				// There's probably a simpler way to do this but it's late and at least it works so ¯\_(ツ)_/¯
				// Get scales first
				let scaleX = this.$store.state.settings.imageDimensions.x / this.$store.state.settings.imageDimensions.y;
				let scaleY = this.$store.state.settings.imageDimensions.y / this.$store.state.settings.imageDimensions.x;
				let biggest;
				if (scaleX !== 1) {
					biggest = scaleX > 1 ? "x" : "y";
				}
				this.canvasDimensions.x = biggest && biggest === "x" ? newDimensions.x * scaleX : newDimensions.x;
				this.canvasDimensions.y = biggest && biggest === "y" ? newDimensions.y * scaleY : newDimensions.y;

				// Update the gridsize as well
				this.gridSize.x = this.canvasDimensions.x / this.$store.state.settings.imageDimensions.x;
				this.gridSize.y = this.canvasDimensions.y / this.$store.state.settings.imageDimensions.y;
			}
		},
		mounted() {
			this.gridSize.x = this.canvasDimensions.x / this.$store.state.settings.imageDimensions.x;
			this.gridSize.y = this.canvasDimensions.y / this.$store.state.settings.imageDimensions.y;
			this.imageCanvas = document.getElementById('canvas');
			this.ctx = this.imageCanvas.getContext('2d');
			this.ctx.mozImageSmoothingEnabled = false;
			this.ctx.webkitImageSmoothingEnabled = false;
			this.ctx.msImageSmoothingEnabled = false;
			this.ctx.imageSmoothingEnabled = false;
			this.newCanvas();
			eventBus.$on("createNewImage", this.newCanvas);
		},
		watch: {
			tempCanvasDimensions: {
				handler: function (newDimensions, oldDimensions) {
					this.createNewDimensions(newDimensions);
				},
				deep: true
			},

		}
	};

</script>

<style lang='scss'>
	@import '~vars';
	#canvas {
		// width: 500px;
		// height: 500px;
		margin: 0 auto; // border: 2px solid red;
		image-rendering: optimizeSpeed;
		image-rendering: -moz-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: -o-crisp-edges;
		image-rendering: pixelated;
		-ms-interpolation-mode: nearest-neighbor;
	}

	#canvas-grid {
		// border: 3px solid hotpink;
		// box-sizing: content-box;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2; // border: 2px solid black;
	}

</style>
