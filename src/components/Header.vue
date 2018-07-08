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
						<i class="icon check"></i>
					</li>
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
				let tempSettings = this.$store.state.seetings;
				tempSettings.gridActive = !tempSettings.gridActive;
				this.$store.dispatch("setSettings", tempSettings);
			},
			openModal(content) {
				this.modalComponent = content;
				this.$refs["modal"].openModal();
			},
			closeModal(){
				this.$refs["modal"].closeModal();
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
		padding: $spacing--large $spacing--medium;
		user-select: none;
		-moz-user-select: -moz-none;

		&:hover,
		&:focus {
			background-color: $background--dark-alt;
			cursor: pointer;
		}
	}

	.logo-area {
		padding: $spacing--large $spacing--huge;
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
			display: none;
		}

		&:focus,
		&:hover {
			.dropdown-items {
				display: block;
				position: absolute;
				top: 100%;
				left: 0;
				background-color: $background--dark;
				padding: 0;
				margin: 0;
				list-style: none;
				.dropdown-item {
					padding: $spacing--small;
					background-color: $background--dark-pressed;
					width: 100%;

					&:hover {
						background-color: $background--dark-alt;
					}
				}
			}
		}
	}

</style>
