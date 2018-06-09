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
			// selected: {},
			tools: [
				{
					name: 'Pencil',
					icon: 'paint brush',
					selected: true,
				},
				{
					name: 'Eyedropper',
					icon: 'eye dropper',
					selected: false,
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
			this.$store.dispatch('setCurrentTool', tool);
			// this.selected = tool;
		},
	},
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
	padding: $spacing--large;
	margin: $spacing--small;
	border-radius: $spacing--small;
	background-color: $background--dark-alt;

	> i {
		height: 100%;
		width: 100%;
		margin: 0;
	}
	&:hover,
	&:focus {
		background-color: red;
		cursor: pointer;
	}
	&.selected {
		background-color: red;
		border: 2px solid $border--dark;
	}
}
</style>
