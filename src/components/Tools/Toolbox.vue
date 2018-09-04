<template>
	<div id="toolbox">
		<!-- TODO: Would prefer for tooltips to not be components, but directives, but this is a bit faster for now -->
		<tooltip v-for="tool in tools" :key="tool.name" :content="`${tool.name} ${tool.shortcutKey ? '('+tool.shortcutKey.toUpperCase()+')' : ''}`">
			<div class="tool" @click="selectTool(tool)" :class="tool.selected?'selected':''">
				<i :class="'large icon ' +tool.icon"></i>
			</div>
		</tooltip>
	</div>
</template>

<script>
import tooltip from "../Tooltip.vue";
export default {
  components: {
    tooltip
  },
  data() {
    return {
      // TODO: Load from seperate files
      tools: [
        // {
        // 	name: "Test",
        // 	icon: "eye",
        // 	onMouseDown: (pos, buffer) => {
        // 		let test = Object.create(
        // 			this.$store.state.settings
        // 		);
        // 		console.log(test);
        // 		console.log(test.gridActive);
        // 	}
        // },
        {
          name: "Pencil",
          icon: "pencil alternate",
          shortcutKey: "b",
          // shortcutCode: 66,
          selected: false,
          isDrawing: false,
          tempBuffer: null,
          onMouseDown: (pos, buffer) => {
            this.tempBuffer = this.$store.state.imageBuffer;
            let rgba = Object.create(this.$store.state.currentColor.rgba);
            this.isDrawing = true;
            // TODO: DRY it up
            this.tempBuffer[pos.bufferPos] = rgba.r; //Red
            this.tempBuffer[pos.bufferPos + 1] = rgba.g; //Green
            this.tempBuffer[pos.bufferPos + 2] = rgba.b; //Blue
            this.tempBuffer[pos.bufferPos + 3] = rgba.a * 255; //Alpha

            this.$store.dispatch("setBuffer", this.tempBuffer);
          },
          onMouseMove: pos => {
            if (this.isDrawing) {
              let rgba = Object.create(this.$store.state.currentColor.rgba);

              this.tempBuffer[pos.bufferPos] = rgba.r; //Red
              this.tempBuffer[pos.bufferPos + 1] = rgba.g; //Green
              this.tempBuffer[pos.bufferPos + 2] = rgba.b; //Blue
              this.tempBuffer[pos.bufferPos + 3] = rgba.a * 255; //Alpha

              this.$store.dispatch("setBuffer", this.tempBuffer);
            }
          },
          onMouseUp: () => {
            this.isDrawing = false;
          }
        },
        {
          name: "Eyedropper",
          icon: "eye dropper",
          shortcutKey: "c",
          // shortcutCode: 67,
          selected: false,
          tempBuffer: null,
          onMouseDown: pos => {
            this.tempBuffer = this.$store.state.imageBuffer;
            let tempColor = Object.create(this.$store.state.currentColor);
            tempColor.rgba.r = this.tempBuffer[pos.bufferPos];
            tempColor.rgba.g = this.tempBuffer[pos.bufferPos + 1];
            tempColor.rgba.b = this.tempBuffer[pos.bufferPos + 2];
            // tempRGBA.a = this.tempBuffer[pos.bufferPos + 3] / 255;
            this.$store.dispatch("setCurrentColor", tempColor);
          }
        },
        {
          name: "Eraser",
          icon: "eraser",
          shortcutKey: "e",
          // shortcutCode: 69,
          selected: false,
          isErasing: false,
          tempBuffer: null,
          onMouseDown: pos => {
            this.tempBuffer = this.$store.state.imageBuffer;
            this.isErasing = true;
            this.tempBuffer[
              pos.bufferPos
            ] = this.$store.state.currentColor.rgba.r; //Red
            this.tempBuffer[
              pos.bufferPos + 1
            ] = this.$store.state.currentColor.rgba.g; //Green
            this.tempBuffer[
              pos.bufferPos + 2
            ] = this.$store.state.currentColor.rgba.b; //Blue
            this.tempBuffer[pos.bufferPos + 3] = 0; //Alpha
            this.$store.dispatch("setBuffer", this.tempBuffer);
          },
          onMouseMove: pos => {
            if (this.isErasing) {
              this.tempBuffer[
                pos.bufferPos
              ] = this.$store.state.currentColor.rgba.r; //Red
              this.tempBuffer[
                pos.bufferPos + 1
              ] = this.$store.state.currentColor.rgba.g; //Green
              this.tempBuffer[
                pos.bufferPos + 2
              ] = this.$store.state.currentColor.rgba.b; //Blue
              this.tempBuffer[pos.bufferPos + 3] = 0; //Alpha
              this.$store.dispatch("setBuffer", this.tempBuffer);
            }
          },
          onMouseUp: pos => {
            this.isErasing = false;
          }
        }
      ]
    };
  },
  methods: {
    selectTool(tool) {
      this.tools.forEach(tool => {
        tool.selected = false;
      });
      tool.selected = true;
      this.$store.dispatch("setCurrentTool", {
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
    window.addEventListener("keydown", e => {
      this.shortcutPress(e);
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", e => {
      this.shortcutPress(e);
    });
  }
};
</script>

<style lang='scss'>
@import "~vars";
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

  > i {
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
