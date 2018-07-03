<template>
	<section id="paint-area">
		<div class="canvas-wrapper" :style="dimensionsToStyle">
			<canvas ref="canvas" id="canvas" :width="this.$store.state.settings.gridDimensions.x" :height="this.$store.state.settings.gridDimensions.y"
			    :style="dimensionsToStyle">
			</canvas>
			<canvas ref="canvas-grid" id="canvas-grid" :width="canvasDimensions.x" :height="canvasDimensions.y" @mousedown="onMouseDown($event)"
			    @mousemove="onMouseMove($event)" @mouseup="onMouseUp($event)" @mouseleave="onMouseUp($event)" :style="dimensionsToStyle"></canvas>
		</div>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				imageCanvas: null,
				ctx: null,
				gridCanvas: null,
				gridCtx: null,
				gridDimensions: {
					x: 16,
					y: 16,
				},
				canvasDimensions: {
					x: 500,
					y: 500,
				},
				imageDimensions: {
					x: 128,
					y: 128,
				},
				dataURI: null,
			};
		},
		computed: {
			dimensionsToStyle: function () {
				return `width:${this.canvasDimensions.x}px;height:${this.canvasDimensions.y}px;`
			}
		},
		methods: {
			paintGrid() {
				let gridSizeX = this.canvasDimensions.x / this.$store.state.settings.gridDimensions.x;
				let gridSizeY = this.canvasDimensions.y / this.$store.state.settings.gridDimensions.y;
				this.gridCtx.clearRect(0, 0, this.canvasDimensions.x, this.canvasDimensions.y);
				if (this.$store.state.settings.gridActive) {
					this.gridCtx.strokeStyle = 'rgba(100,100,100,50)';
					for (let x = 0; x <= this.$store.state.settings.gridDimensions.x; x++) {
						this.gridCtx.beginPath;
						this.gridCtx.moveTo(x * gridSizeX, 0);
						this.gridCtx.lineTo(x * gridSizeX, this.canvasDimensions.x);
						this.gridCtx.stroke();
					}
					for (let y = 0; y <= this.$store.state.settings.gridDimensions.y; y++) {
						this.gridCtx.beginPath;
						this.gridCtx.moveTo(0, y * gridSizeY);
						this.gridCtx.lineTo(this.canvasDimensions.y, y * gridSizeY);
						this.gridCtx.stroke();
					}
				}
			},
			updateImage() {
				let idata = this.ctx.createImageData(
					this.$store.state.settings.gridDimensions.x,
					this.$store.state.settings.gridDimensions.y,
				);
				idata.data.set(this.$store.state.imageBuffer);
				this.ctx.putImageData(idata, 0, 0);
			},
			onMouseDown(e) {
				if (this.$store.state.currentTool.onMouseDown) {
					let pos = this.getPosition(e.layerX, e.layerY);
					console.log(pos);

					this.$store.state.currentTool.onMouseDown(pos);
				}
				this.updateImage();
			},
			onMouseMove(e) {
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
				// console.log(pos);

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
			handleScroll(e) {
				// console.log(e);
				this.canvasDimensions.x -= e.deltaY * this.$store.state.settings.zoomSensitivity;
				this.canvasDimensions.y -= e.deltaY * this.$store.state.settings.zoomSensitivity;
				if (this.canvasDimensions.x < 30) this.canvasDimensions.x = 30;
				if (this.canvasDimensions.y < 30) this.canvasDimensions.y = 30;
				// this.paintGrid();
			},
			createBuffer() {
				this.tempBuffer = new Uint8ClampedArray(
					this.$store.state.settings.gridDimensions.x * this.$store.state.settings.gridDimensions.y * 4,
				);
				console.log(this.tempBuffer);
				for (var y = 0; y < this.$store.state.settings.gridDimensions.y; y++) {
					for (var x = 0; x < this.$store.state.settings.gridDimensions.x; x++) {
						var pos = (y * this.$store.state.settings.gridDimensions.x + x) * 4; // position in buffer based on x and y
						this.tempBuffer[pos] = 0; // some R value [0, 255]
						this.tempBuffer[pos + 1] = 0; // some G value
						this.tempBuffer[pos + 2] = 0; // some B value
						this.tempBuffer[pos + 3] = 0; // set alpha channel
					}
				}
				// console.log(this.tempBuffer);
				this.$store.dispatch('setBuffer', this.tempBuffer);
			},
			newCanvas() {
				this.createBuffer();
				this.updateImage();
				this.paintGrid();
			}
		},
		mounted() {
			document.getElementById("paint-area").addEventListener('wheel', (e) => this.handleScroll(e));
			this.imageCanvas = document.getElementById('canvas');
			this.ctx = this.imageCanvas.getContext('2d');
			this.gridCanvas = document.getElementById('canvas-grid');
			this.gridCtx = this.gridCanvas.getContext('2d');
			this.ctx.mozImageSmoothingEnabled = false;
			this.ctx.webkitImageSmoothingEnabled = false;
			this.ctx.msImageSmoothingEnabled = false;
			this.ctx.imageSmoothingEnabled = false;

			this.newCanvas();
		},
		beforeDestroy() {
			document.getElementById('paint-area').removeEventListener('wheel', this.handleScroll);
		},
		watch: {
			canvasDimensions: {
				handler: function (newDimensions, oldDimensions) {
					// console.log("Watce");
					setTimeout(() => {
						this.paintGrid();
					}, 1);
					// this.paintGrid();
				},
				deep: true
			}
		}
	};

</script>

<style lang="scss">
	@import '../static/globals.scss';
	#paint-area {
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

	.canvas-wrapper {
		position: relative; // width: 500px;
		// height: 500px;
		border: 2px solid black;
	}

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
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}

</style>
