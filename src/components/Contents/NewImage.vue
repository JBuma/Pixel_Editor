<template>
	<div class="export-options">
		<div slot="modal-content" class="export-form">
			<div class="form-group half-width">
				<div class="input-group">
					<label for="export-x">
						X:
					</label>
					<input type="number" name="export-x" v-model="xSize">
				</div>
				<div class="input-group">
					<button class="icon light centered">
						<i class="icon linkify large"></i>
					</button>
				</div>
				<div class="input-group">
					<label for="export-y">
						Y:
					</label>
					<input type="number" name="export-y" v-model="ySize">
				</div>
			</div>
			<div class="form-group half-width">
				<div class="input-group">
					<label for="preset">
						Preset:
					</label>
					<select name="preset" v-model="preset">
						<option>8x8</option>
						<option>16x16</option>
						<option>32x32</option>
						<option>64x64</option>
						<option>128x128</option>
						<option>256x256</option>
					</select>
				</div>
			</div>
		</div>
		<div class="controls" slot='modal-controls'>
			<button @click="newImage" class="primary">New</button>
		</div>
	</div>
</template>

<script>
	import {
		eventBus
	} from "../eventBus.js";
	export default {

		data() {
			return {
				preset: "16x16",
				xSize: 16,
				ySize: 16
			}
		},
		methods: {
			newImage() {
				let tempSettings = { ...this.$store.state.settings
				};
				let tempDimensions = { ...tempSettings.imageDimensions
				}
				// console.log(tempSettings);
				tempDimensions.x = this.xSize;
				tempDimensions.y = this.ySize;
				tempSettings.imageDimensions = tempDimensions;
				this.$store.dispatch("setSettings", tempSettings);
				this.$emit("closeModal");
				eventBus.$emit("createNewImage");
			}
		},
		watch: {
			preset: function () {
				let string = this.preset.split("x");
				this.xSize = string[0];
				this.ySize = string[1];
			}
		}
	}

</script>

<style lang='scss'>
	@import '~vars';

</style>
