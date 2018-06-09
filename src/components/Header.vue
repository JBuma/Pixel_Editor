<template>
	<nav id="header">
		<div class="logo-area item">LOGO</div>
		<ul class="menu-items">
			<li class="item"><i class="file icon"></i> File</li>
			<li class="item"><i class="cogs icon"></i>Settings</li>
			<li class="item"><i class="question icon"></i>Help</li>
		</ul>
	</nav>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import '../static/globals.scss';
#header {
	width: 100%; // min-height: 50px;
	max-height: 150px; // padding: 0 $spacing--huge;
	background-color: $background--dark;
	color: $text--dark;
	display: flex;
	flex-flow: row nowrap; // justify-content: space-around;
}

.item {
	padding: $spacing--large $spacing--medium;

	&:hover {
		background-color: $background--dark-alt;
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
}
</style>
