<template>
	<div class="export-options">
		<div slot="modal-content" class="export-form">
			<div class="form-group half-width">
				<div class="input-group">
					<label for="export-x">
						X:
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
						Y:
					</label>
					<input type="number" name="export-y" v-model="yExport">
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
						<option>512x512</option>
						<option>1024x1024</option>
					</select>
				</div>
				<div class="input-group">
					<label for="export-name">Filename:</label>
					<input type="text" name="export-name" id="export-name" v-model="exportName">
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
      yExport: 16,
      exportName: "Pixel Art"
    };
  },
  methods: {
    exportImage() {
      let imageCanvas = document.getElementById("canvas");
      // console.log(imageCanvas);
      let tempCanvas = document.createElement("canvas");
      tempCanvas.width = this.xExport;
      tempCanvas.height = this.yExport;

      tempCanvas.style =
        "image-rendering: optimizeSpeed;image-rendering: -moz-crisp-edges;image-rendering: -webkit-optimize-contrast;image-rendering: -o-crisp-edges;	image-rendering: pixelated;	-ms-interpolation-mode: nearest-neighbor;";
      let tempCtx = tempCanvas.getContext("2d");
      tempCtx.mozImageSmoothingEnabled = false;
      tempCtx.webkitImageSmoothingEnabled = false;
      tempCtx.msImageSmoothingEnabled = false;
      tempCtx.imageSmoothingEnabled = false;
      tempCtx.drawImage(imageCanvas, 0, 0, this.xExport, this.yExport);
      var img = tempCanvas.toDataURL("image/png;base64;");
      // window.open(tempCanvas.toDataURL());

      let anchorElement = document.createElement("a"); // Create a download link
      anchorElement.href = tempCanvas.toDataURL(); // attach the image data URL
      // check for download attribute

      if (anchorElement.download !== undefined) {
        anchorElement.download = this.exportName + ".png"; // set the download filename
        if (typeof MouseEvent === "function") {
          // does the browser support the object MouseEvent
          let event = new MouseEvent("click", {
            // yes create a new mouse click event
            view: window,
            bubbles: true,
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            buttons: 1
          });
          anchorElement.dispatchEvent(event); // simulate a click on the download link.
        } else if (anchorElement.fireEvent) {
          // if no MouseEvent object try fireEvent
          anchorElement.fireEvent("onclick");
        }
      } else {
        window.open(tempCanvas.toDataURL("image/png"));
      }
    }
  },
  watch: {
    preset: function() {
      let string = this.preset.split("x");
      this.xExport = string[0];
      this.yExport = string[1];
      // console.log("YE");
      // this.xExport
    }
  }
};
</script>

<style lang='scss'>
@import "~vars";
.export-form {
  width: 100%;
}
</style>
