<template>
	<span class="tooltip-wrapper">
		<div class="tooltip">
			{{content}}
		</div>
		<slot></slot>
	</span>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			content: {
				type: String,
				default: ""
			}
		}
	}

</script>

<style lang="scss">
	@import "~vars";
	.tooltip-wrapper {
		position: relative;
		&:hover .tooltip {
			transition: opacity 0.2s 0.75s ease-out;
			visibility: visible;
			opacity: 1;
		}
	}

	.tooltip {
		transition: opacity 0.1s 0s ease-out;
		visibility: hidden;
		opacity: 0; // clear: both;
		position: absolute;
		bottom: 100%;
		left: 50%;
		margin-left: -$tooltip-width/2;
		min-width: $tooltip-width;
		border-radius: 3px;
		padding: $spacing--small $spacing--large;
		text-align: center;
		background-color: $background--dark-pressed;
		z-index: 1;
		-moz-user-select: none;
		user-select: none;

		cursor: default;

		&:after {
			content: '';
			position: absolute;
			top: 100%;
			left: 50%;
			width: 0;
			height: 0;
			border-left: 5px solid transparent;
			border-right: 5px solid transparent;

			border-top: 5px solid $background--dark-alt;
		}
	}

</style>
