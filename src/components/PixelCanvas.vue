<template>
	<div class="canvas-wrapper">
		<canvas ref="canvas" id="canvas" :width="this.$store.state.settings.gridDimensions.x" :height="this.$store.state.settings.gridDimensions.y"
		    :style="dimensionsToStyle">
		</canvas>
		<div ref="canvas-grid" id="canvas-grid" :width="canvasDimensions.x" :height="canvasDimensions.y" @mousedown.left="onMouseDown($event)"
		    @mousemove="onMouseMove($event)" @mouseup="onMouseUp($event)" @mouseleave="onMouseUp($event)" :style="dimensionsToStyle">
			<!-- Blocks clicking/dragging the grid -->
			<div id="image-blocker" style="width:100%;height:100%;z-index:2;position:absolute;"></div>
			<!-- Grid -->
			<svg :style="dimensionsToStyle+'z-index:1;'" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern id="smallGrid" :width="gridSize.x" :height="gridSize.y" patternUnits="userSpaceOnUse">
						<path :d="smallGridPath" fill="none" stroke="rgba(150,150,150,0.75)" stroke-width="1" />
					</pattern>
					<pattern id="grid" :width="gridSize.x*10" :height="gridSize.y*10" patternUnits="userSpaceOnUse">
						<rect width="80" height="80" fill="url(#smallGrid)" />
						<path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="2" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#smallGrid)" stroke="rgb(0,0,0)" stroke-width="4" />
			</svg>
		</div>

	</div>
</template>

<script>
import {eventBus} from "./eventBus.js";

	export default {
		data() {
			return {
				imageCanvas: null,
				ctx: null,
				gridDimensions: {
					x: 16,
					y: 16,
				},
				imageDimensions: {
					x: 128,
					y: 128,
				},
				gridSize: {
					x: 16,
					y: 16
				},
				dataURI: null,
			};
		},
		props: {
			canvasDimensions: {
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
			}
		},
		methods: {
			updateImage() {
				let idata = this.ctx.createImageData(
					this.$store.state.settings.gridDimensions.x,
					this.$store.state.settings.gridDimensions.y,
				);
				idata.data.set(this.$store.state.imageBuffer);
				this.ctx.putImageData(idata, 0, 0);
			},
			onMouseDown(e) {
				e.stopPropagation();

				if (this.$store.state.currentTool.onMouseDown) {
					let pos = this.getPosition(e.layerX, e.layerY);
					console.log(pos);

					this.$store.state.currentTool.onMouseDown(pos);
				}
				this.updateImage();
			},
			onMouseMove(e) {
				e.stopPropagation();
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
					x / (this.canvasDimensions.x / this.$store.state.settings.gridDimensions.x),
				);
				pos.gridY = Math.floor(
					y / (this.canvasDimensions.y / this.$store.state.settings.gridDimensions.y),
				);
				pos.bufferPos = (pos.gridY * this.$store.state.settings.gridDimensions.x + pos.gridX) * 4;
				return pos;
			},
			saveImage() {
				this.dataURI = this.imageCanvas.toDataURL();

				let tempCanvas = document.createElement('canvas');
				tempCanvas.width = this.imageDimensions.x;
				tempCanvas.height = this.imageDimensions.y;

				tempCanvas.style =
					'image-rendering: optimizeSpeed;image-rendering: -moz-crisp-edges;image-rendering: -webkit-optimize-contrast;image-rendering: -o-crisp-edges;	image-rendering: pixelated;	-ms-interpolation-mode: nearest-neighbor;';
				let tempCtx = tempCanvas.getContext('2d');
				tempCtx.mozImageSmoothingEnabled = false;
				tempCtx.webkitImageSmoothingEnabled = false;
				tempCtx.msImageSmoothingEnabled = false;
				tempCtx.imageSmoothingEnabled = false;
				tempCtx.drawImage(
					this.imageCanvas,
					0,
					0,
					this.imageDimensions.x,
					this.imageDimensions.y,
				);
				window.open(tempCanvas.toDataURL());
				console.log(this.dataURI);
			},
			createBuffer() {
				this.tempBuffer = new Uint8ClampedArray(
					this.$store.state.settings.gridDimensions.x * this.$store.state.settings.gridDimensions.y * 4,
				);
				for (var y = 0; y < this.$store.state.settings.gridDimensions.y; y++) {
					for (var x = 0; x < this.$store.state.settings.gridDimensions.x; x++) {
						var pos = (y * this.$store.state.settings.gridDimensions.x + x) * 4; // position in buffer based on x and y
						this.tempBuffer[pos] = 0; // some R value [0, 255]
						this.tempBuffer[pos + 1] = 0; // some G value
						this.tempBuffer[pos + 2] = 0; // some B value
						this.tempBuffer[pos + 3] = 0; // set alpha channel
					}
				}
				this.$store.dispatch('setBuffer', this.tempBuffer);
			},
			newCanvas() {
				this.createBuffer();
				this.updateImage();
				this.gridSize.x = this.canvasDimensions.x / this.$store.state.settings.gridDimensions.x;
				this.gridSize.y = this.canvasDimensions.y / this.$store.state.settings.gridDimensions.y;
			},
			createNewImage(){

			}
		},
		mounted() {
			this.gridSize.x = this.canvasDimensions.x / this.$store.state.settings.gridDimensions.x;
			this.gridSize.y = this.canvasDimensions.y / this.$store.state.settings.gridDimensions.y;
			this.imageCanvas = document.getElementById('canvas');
			this.ctx = this.imageCanvas.getContext('2d');
			this.ctx.mozImageSmoothingEnabled = false;
			this.ctx.webkitImageSmoothingEnabled = false;
			this.ctx.msImageSmoothingEnabled = false;
			this.ctx.imageSmoothingEnabled = false;
			this.newCanvas();
			eventBus.$on("createNewImage",this.newCanvas);
		},
		watch: {
			canvasDimensions: {
				handler: function (newDimensions, oldDimensions) {
					this.gridSize.x = this.canvasDimensions.x / this.$store.state.settings.gridDimensions.x;
					this.gridSize.y = this.canvasDimensions.y / this.$store.state.settings.gridDimensions.y;
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
