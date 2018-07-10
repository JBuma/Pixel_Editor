<template>
	<div id="toolbox">
		<div v-for="tool in tools" :key="tool.name" class="tool" @click="selectTool(tool)" :class="tool.selected?'selected':''">
			<i :class="'large icon ' +tool.icon"></i>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// TODO: Load from seperate files
				tools: [{
						name: 'Pencil',
						icon: 'paint brush',
						shortcutKey: "b",
						// shortcutCode: 66,
						selected: false,
						isDrawing: false,
						tempBuffer: null,
						onMouseDown: (pos) => {
							this.tempBuffer = this.$store.state.imageBuffer;
							this.isDrawing = true;
							this.tempBuffer[pos.bufferPos] = this.$store.state.currentColor.r; //Red
							this.tempBuffer[pos.bufferPos + 1] = this.$store.state.currentColor.g; //Green
							this.tempBuffer[pos.bufferPos + 2] = this.$store.state.currentColor.b; //Blue
							this.tempBuffer[pos.bufferPos + 3] = this.$store.state.currentColor.a * 255; //Alpha
							this.$store.dispatch("setBuffer", this.tempBuffer);
						},
						onMouseMove: (pos) => {
							if (this.isDrawing) {
								this.tempBuffer[pos.bufferPos] = this.$store.state.currentColor.r; //Red
								this.tempBuffer[pos.bufferPos + 1] = this.$store.state.currentColor.g; //Green
								this.tempBuffer[pos.bufferPos + 2] = this.$store.state.currentColor.b; //Blue
								this.tempBuffer[pos.bufferPos + 3] = this.$store.state.currentColor.a * 255; //Alpha
								this.$store.dispatch("setBuffer", this.tempBuffer);
							}
						},
						onMouseUp: () => {
							this.isDrawing = false;
						}
					},
					{
						name: 'Eyedropper',
						icon: 'eye dropper',
						shortcutKey: "c",
						// shortcutCode: 67,
						selected: false,
						tempBuffer: null,
						onMouseDown: (pos) => {
							this.tempBuffer = this.$store.state.imageBuffer;
							let tempColor = { ...this.$store.state.currentColor
							};
							tempColor.r = this.tempBuffer[pos.bufferPos];
							tempColor.g = this.tempBuffer[pos.bufferPos + 1];
							tempColor.b = this.tempBuffer[pos.bufferPos + 2];
							tempColor.a = this.tempBuffer[pos.bufferPos + 3];
							this.$store.dispatch('setCurrentColor', tempColor);
						},
					},
					{
						name: 'Eraser',
						icon: 'eraser',
						shortcutKey: "e",
						// shortcutCode: 69,
						selected: false,
						isErasing: false,
						tempBuffer: null,
						onMouseDown: (pos) => {
							this.tempBuffer = this.$store.state.imageBuffer;
							this.isErasing = true
							this.tempBuffer[pos.bufferPos] = this.$store.state.currentColor.r; //Red
							this.tempBuffer[pos.bufferPos + 1] = this.$store.state.currentColor.g; //Green
							this.tempBuffer[pos.bufferPos + 2] = this.$store.state.currentColor.b; //Blue
							this.tempBuffer[pos.bufferPos + 3] = 0; //Alpha
							this.$store.dispatch("setBuffer", this.tempBuffer);
						},
						onMouseMove: (pos) => {
							if (this.isErasing) {
								this.tempBuffer[pos.bufferPos] = this.$store.state.currentColor.r; //Red
								this.tempBuffer[pos.bufferPos + 1] = this.$store.state.currentColor.g; //Green
								this.tempBuffer[pos.bufferPos + 2] = this.$store.state.currentColor.b; //Blue
								this.tempBuffer[pos.bufferPos + 3] = 0; //Alpha
								this.$store.dispatch("setBuffer", this.tempBuffer);
							}
						},
						onMouseUp: (pos) => {
							this.isErasing = false;
						}
					},
				],
			};
		},
		methods: {
			selectTool(tool) {
				this.tools.forEach(tool => {
					tool.selected = false;
				});
				tool.selected = true;
				this.$store.dispatch('setCurrentTool', {
					...tool
				});
			},
			shortcutPress(e) {
				this.tools.forEach(tool => {
					if (tool.shortcutKey === e.key) {
						this.selectTool(tool);
					}
				});
			}
		},
		mounted() {
			this.selectTool(this.tools[0]);
			window.addEventListener("keydown", (e) => {
				this.shortcutPress(e);
			});
		},
		beforeDestroy() {
			window.removeEventListener("keydown", (e) => {
				this.shortcutPress(e);
			});
		}
	};

</script>

<style lang='scss'>
	@import '~vars';
	#toolbox {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
	}

	.tool {
		position: relative;
		padding: $spacing--medium;
		margin: $spacing--small;
		border-radius: $spacing--small;
		background-color: $background--dark-alt;
		border: 2px solid $border--dark;

		>i {
			height: 100%;
			width: 100%;
			margin: 0;
		}
		&:hover,
		&:focus {
			background-color: $background--dark-pressed;
			cursor: pointer;
		}
		&.selected {
			background-color: $background--dark-pressed;
			border: 2px solid $border--light;
		}
	}

</style>
