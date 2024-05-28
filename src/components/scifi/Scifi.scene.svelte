<script>
	export let value, barHeight, bottomPadding, viewType;
	let opacity = 0;
	$:{
		if (viewType != "") {
			opacity = 1;
		} else {
			opacity = 0;
		}
	}
</script>

<div class="scene" style="height: {barHeight}px; bottom: {bottomPadding}px; opacity: {opacity};">
<!-- 	{#each [0,1,2,3,4,5,6,7,8,9] as num}
	<div class="num" style="top:{num *10}%;">{num}</div>
	{/each} -->
	<img src="assets/scifi/test.png" />

</div>

<style>
	.scene {
		position: absolute;
		bottom: 60px;
		right: 100%;
		height: calc(100% - 60px);
		width: 100%;
		border: 4px solid #000;
		transition: opacity 2000ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
	}
	.scene img {
		position: absolute;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		image-rendering: -moz-crisp-edges;
		image-rendering: -moz-crisp-edges;
		image-rendering: -o-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		-ms-interpolation-mode: nearest-neighbor;
	}
	.num {
		position: absolute;
		left: 0;
		width: 100%;
		border: 1px solid #000;
		height: 10%;
		background: pink;
	}
</style>
