<template>
	<nav id="header">
		<div class="logo-area item">LOGO</div>
		<div class="menu-items">
			<div tabindex="0" class="item dropdown">
				<p>
					<i class="file icon"></i> File</p>
				<ul class="dropdown-items">
					<li @click="openModal('NewImage')" tabindex="0" class="dropdown-item">New</li>
					<li @click="openModal('ExportImage')" tabindex="0" class="dropdown-item">Export</li>
				</ul>
			</div>
			<div tabindex="0" class="item dropdown">
				<p>
					<i class="cogs icon"></i>Settings</p>
				<ul class="dropdown-items">
					<li @click="toggleGrid" tabindex="0" class="dropdown-item">Grid:
						<i v-if="this.$store.state.settings.gridActive" class="icon check"></i>
					</li>
				</ul>
			</div>
			<div tabindex="0" class="item dropdown">
				<p>
					<i class="question icon"></i>Info</p>
				<ul class="dropdown-items">
					<a href="https://github.com/JBuma/Pixel_Editor" target="_blank">
						<li tabindex="0" class="dropdown-item external-link">
							GitHub Repo
						</li>
					</a>
				</ul>
			</div>
		</div>
		<modal ref="modal" width="600px" height="600px" :can-cancel=false>
			<component v-on:closeModal="closeModal" slot="modal-content" :is="modalComponent"></component>
		</modal>
	</nav>
</template>

<script>
	import modal from "./Modal.vue";
	import ExportImage from "./Contents/Export.vue";
	import NewImage from "./Contents/NewImage.vue";
	export default {
		components: {
			modal,
			ExportImage,
			NewImage
		},
		data() {
			return {
				modalComponent: "ExportImage"
			}
		},
		methods: {
			toggleGrid() {
				let tempSettings = { ...this.$store.state.settings
				};
				tempSettings.gridActive = !tempSettings.gridActive;
				this.$store.dispatch("setSettings", tempSettings);
			},
			openModal(content) {
				this.modalComponent = content;
				this.$refs["modal"].openModal();
			},
			closeModal() {
				this.$refs["modal"].closeModal();
			},
			linkTo(link) {
				window.open(link);
			}
		}
	};

</script>

<style lang="scss">
	@import "~vars";
	#header {
		width: 100%;
		max-height: 150px;
		background-color: $background--dark;
		color: $text--dark;
		display: flex;
		flex-flow: row nowrap;
	}

	.item {
		padding: $spacing--medium $spacing--medium;
		user-select: none;
		-moz-user-select: -moz-none;
		min-width: $header-item--width;

		&:hover,
		&:focus {
			background-color: $background--dark-alt;
			cursor: pointer;
		}
	}

	.logo-area {
		padding: $spacing--medium $spacing--huge;
	}

	.menu-items {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-flow: row nowrap;
		p {
			margin: 0;
		}
	}

	.dropdown {
		margin: 0;
		position: relative;
		.dropdown-items {

			display: none; // min-width: $dropdown-item--width;
		}

		&:focus,
		&:hover {
			.dropdown-items {
				min-width: 100%;
				display: initial;
				position: absolute;
				top: 100%;
				left: 0;
				background-color: $background--dark;
				padding: 0;
				margin: 0;
				list-style: none;
				z-index: 10;
				.dropdown-item {
					padding: $spacing--small;
					background-color: $background--dark-pressed;
					width: auto;
					min-width: 100%;

					&:hover {
						background-color: $background--dark-alt;
					}
				}
			}
		}
	}

	.external-link {
		&:after {
			font-family: Icons;
			content: "\f35d";
		}
	}

</style>
