<template>
	<section id="sidebar">
		<h1>Tools</h1>
		<div class="tools">
			<toolbox/>
			<color-selector></color-selector>
		</div>
	</section>
</template>

<script>
	import colorSelector from './Tools/colorSelector.vue';
	import toolbox from './Tools/Toolbox.vue';
	export default {
		components: {
			colorSelector,
			toolbox,
		},
	};

</script>

<style lang="scss">
	@import '../static/globals.scss';
	#sidebar {
		padding: $spacing--medium;
		height: 100%;
		min-width: 200px;
		max-width: 400px;
		width: 20vw;
		background-color: $background--dark;
		color: $text--dark;
	}

</style>
