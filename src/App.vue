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

	input,
	select {
		border: 2px solid rgba(0, 0, 0, 0);
		background-color: $background--dark-alt;
		color: $text--dark-secondary;
		padding: $spacing--small;
		border-radius: $spacing--small;

		transition: border .1s ease-out;

		&:focus {
			outline: none;
			border: 2px solid $background--dark;
		}
	}

	.input-group {
		flex-basis: 100%;
		flex-grow: 1;
		padding: $spacing--small;
		display: flex;
		flex-flow: row nowrap; // justify-content: space-between;
		align-items: center;

		label {
			font-size: $text--large;
			margin: $spacing--small;
		}
	}

	.form-group {
		padding: $spacing--small;
		flex-flow: row wrap;

		&.half-width {
			width: 50%;
			float: left;
		}
	}

	button {
		border-style: none;
		padding: $spacing--small $spacing--medium;
		text-transform: capitalize;
		border-radius: $spacing--small;
		transition: .1s ease-out;
		&.borderless {
			border: none;
		}
		&.centered {
			margin: 0 auto;
		}
		&.icon {
			padding: $spacing--small; // padding: 0;
			>i {
				width: 100%;
				height: 100%;
				margin: 0;
			}
		}
		&.light {
			background-color: transparent;
			color: $text--dark;
			&:not(.borderless) {
				border-style: solid;
			}
			&.borderless {}
			&:hover,
			&:focus {
				background-color: $background--light;
				color: $text--light;
			}
		}

		&:focus,
		&:hover {
			outline: none;

			box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
		}
		&:active,
		&.active {
			transform: translateY(-2px);
		}
		&.primary {
			background-color: $color--primary;
			color: $text--dark;
			font-weight: bold;

			&:focus,
			&:hover {
				background-color: $color--primary-pressed;

			}
		}
		&.dark {
			background-color: $background--dark;
		}
	}

</style>
