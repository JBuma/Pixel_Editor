<template>
	<section id="paint-area">
		<div class="canvas-wrapper">
			<canvas ref="canvas" id="canvas" :width="gridDimensions.x" :height="gridDimensions.y">
			</canvas>
			<!-- TODO: Make canvas size not hardcoded -->
			<canvas ref="canvas-grid" id="canvas-grid" width="500" height="500" v-on:click="useTool($event)" @contextmenu="deletePixel($event)"></canvas>
		</div>

		<div class="control-group">
			<button id="save-image" v-on:click="saveImage">Save image</button>
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

			zoomLevel: 100,
			buffer: null,
			dataURI: null,
		};
	},
	methods: {
		paintGrid() {
			let gridSize = this.canvasDimensions.x / this.gridDimensions.x;
			this.gridCtx.strokeStyle = 'rgba(100,100,100,50)';
			for (let x = 0; x < this.gridDimensions.x; x++) {
				this.gridCtx.beginPath;
				this.gridCtx.moveTo(x * gridSize, 0);
				this.gridCtx.lineTo(x * gridSize, this.canvasDimensions.x);
				this.gridCtx.stroke();
			}
			for (let y = 0; y < this.gridDimensions.y; y++) {
				this.gridCtx.beginPath;
				this.gridCtx.moveTo(0, y * gridSize);
				this.gridCtx.lineTo(this.canvasDimensions.y, y * gridSize);
				this.gridCtx.stroke();
			}
		},
		paintSelectedPixel(e) {
			if (e.target !== this.gridCanvas) {
			}
		},
		updateImage() {
			let idata = this.ctx.createImageData(
				this.gridDimensions.x,
				this.gridDimensions.y,
			);
			idata.data.set(this.buffer);
			this.ctx.putImageData(idata, 0, 0);
			// paintGrid();
		},
		// TODO: Move out into seperate file??
		useTool(e) {
			switch (this.$store.state.currentTool.name) {
				case 'Eyedropper':
					this.getColor(e);
					break;
				case 'Pencil':
					this.placePixel(e);
					break;
				default:
					break;
			}
		},
		getPosition(x, y) {
			let xPos = Math.floor(
				x / (this.canvasDimensions.x / this.gridDimensions.x),
			);
			let yPos = Math.floor(
				y / (this.canvasDimensions.y / this.gridDimensions.y),
			);
			let pos = (yPos * this.gridDimensions.x + xPos) * 4;
			return pos;
		},
		placePixel(e) {
			let pos = this.getPosition(e.layerX, e.layerY);
			this.buffer[pos] = this.$store.state.currentColor.r; //Red
			this.buffer[pos + 1] = this.$store.state.currentColor.g; //Green
			this.buffer[pos + 2] = this.$store.state.currentColor.b; //Blue
			this.buffer[pos + 3] = this.$store.state.currentColor.a * 255; //Alpha

			this.updateImage();
		},
		getColor(e) {
			let pos = this.getPosition(e.layerX, e.layerY);
			let color = {
				r: 255,
				g: 255,
				b: 255,
				a: 1,
			};
			color.r = this.buffer[pos];
			color.g = this.buffer[pos + 1];
			color.b = this.buffer[pos + 2];
			color.a = this.buffer[pos + 3] / 255;
			this.$store.dispatch('setCurrentColor', color);
		},
		deletePixel(e) {
			let pos = this.getPosition(e.layerX, e.layerY);
			this.buffer[pos] = this.$store.state.currentColor.r; //Red
			this.buffer[pos + 1] = this.$store.state.currentColor.g; //Green
			this.buffer[pos + 2] = this.$store.state.currentColor.b; //Blue
			this.buffer[pos + 3] = 0; //Alpha
			this.updateImage();
			e.preventDefault();
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
	},
	mounted() {
		this.imageCanvas = document.getElementById('canvas');
		this.ctx = this.imageCanvas.getContext('2d');
		this.gridCanvas = document.getElementById('canvas-grid');
		this.gridCtx = this.gridCanvas.getContext('2d');
		this.ctx.mozImageSmoothingEnabled = false;
		this.ctx.webkitImageSmoothingEnabled = false;
		this.ctx.msImageSmoothingEnabled = false;
		this.ctx.imageSmoothingEnabled = false;
		this.buffer = new Uint8ClampedArray(
			this.gridDimensions.x * this.gridDimensions.y * 4,
		);
		for (var y = 0; y < this.gridDimensions.y; y++) {
			for (var x = 0; x < this.gridDimensions.x; x++) {
				var pos = (y * this.gridDimensions.x + x) * 4; // position in buffer based on x and y
				this.buffer[pos] = 255; // some R value [0, 255]
				this.buffer[pos + 1] = 0; // some G value
				this.buffer[pos + 2] = 0; // some B value
				this.buffer[pos + 3] = 0; // set alpha channel
			}
		}
		this.updateImage();
		this.paintGrid();
	},
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
}

.canvas-wrapper {
	position: relative;
	width: 500px;
	height: 500px;
	border: 1px solid black;
}

#canvas {
	width: 500px;
	height: 500px;
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
	z-index: 10;
}
</style>
