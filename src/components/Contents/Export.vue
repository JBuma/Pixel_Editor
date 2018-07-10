<template>
	<div class="export-options">
		<div slot="modal-content" class="export-form">
			<div class="form-group half-width">
				<div class="input-group">
					<label for="export-x">
						<strong> X:</strong>
					</label>
					<input type="number" name="export-x" v-model="xExport">
				</div>
				<div class="input-group">
					<button class="icon light centered">
						<i class="icon linkify large"></i>
					</button>
				</div>
				<div class="input-group">
					<label for="export-y">
						<strong>Y:</strong>
					</label>
					<input type="number" name="export-y" v-model="yExport">
				</div>
			</div>
			<div class="form-group half-width">
				<div class="input-group">
					<label for="preset">
						<strong>Preset: </strong>
					</label>
					<select name="preset" v-model="preset">
						<option>8x8</option>
						<option>16x16</option>
						<option>32x32</option>
						<option>64x64</option>
						<option>128x128</option>
						<option>256x256</option>
						<option>512x512</option>
						<option>1024x1024</option>
					</select>
				</div>
			</div>
		</div>
		<div class="controls" slot='modal-controls'>
			<button @click="exportImage" class="primary">Export</button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				preset: "16x16",
				xExport: 16,
				yExport: 16
			}
		},
		methods: {
			exportImage() {
				let imageCanvas = document.getElementById("canvas");
				console.log(imageCanvas);
				let tempCanvas = document.createElement('canvas');
				tempCanvas.width = this.xExport;
				tempCanvas.height = this.yExport;

				tempCanvas.style =
					'image-rendering: optimizeSpeed;image-rendering: -moz-crisp-edges;image-rendering: -webkit-optimize-contrast;image-rendering: -o-crisp-edges;	image-rendering: pixelated;	-ms-interpolation-mode: nearest-neighbor;';
				let tempCtx = tempCanvas.getContext('2d');
				tempCtx.mozImageSmoothingEnabled = false;
				tempCtx.webkitImageSmoothingEnabled = false;
				tempCtx.msImageSmoothingEnabled = false;
				tempCtx.imageSmoothingEnabled = false;
				tempCtx.drawImage(
					imageCanvas,
					0,
					0,
					this.xExport,
					this.yExport,
				);
				window.open(tempCanvas.toDataURL());
			},
		},
		watch: {
			preset: function () {
				let string = this.preset.split("x");
				this.xExport = string[0];
				this.yExport = string[1];
				console.log("YE");
				// this.xExport
			}
		}
	}

</script>

<style lang='scss'>
	@import '~vars';

</style>
