<template>
	<div id="app">
		<paintarea></paintarea>
	</div>
</template>

<script>
	import Sidebar from "./components/Sidebar.vue";
	import Paintarea from "./components/Paintarea.vue";
	export default {
		components: {
			Sidebar,
			Paintarea
		},
		name: 'app',
	}

</script>

<style lang="scss">
	@import './static/globals.scss';
	@import './static/reset.scss';
	#app {
		width: 100%;
		height: 100%;
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: $text--light;
		display: flex;
		flex-flow: row nowrap;
	}

	html,
	body {
		height: 100vh;
		width: 100vw;
	}

</style>
