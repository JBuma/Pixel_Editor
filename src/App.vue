<template>
	<div id="app">
		<nav-header></nav-header>
		<div class="main-wrapper">
			<sidebar></sidebar>
			<paintarea></paintarea>
		</div>

	</div>
</template>

<script>
	import Sidebar from "./components/Sidebar.vue";
	import Paintarea from "./components/Paintarea.vue";
	import navHeader from "./components/Header.vue";
	export default {
		components: {
			Sidebar,
			Paintarea,
			navHeader
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
		flex-flow: column nowrap;
	}

	html,
	body {
		height: 100vh;
		width: 100vw;
	}

	.main-wrapper {
		display: flex;
		flex-flow: row nowrap;
		flex-grow: 1;
	}

</style>
