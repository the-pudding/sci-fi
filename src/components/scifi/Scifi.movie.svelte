<script>
	export let data, position, sortedColumn, decade, viewType;

	const year = data["first_year"];
	let addClass = "";
	let tooltip_orientation = "";

	let shown = "";

	let currentPos = position.x+position.y+position.speed;
	function toggleTooltip() {
		shown = true;
		tooltip_orientation = "left";
		if (decade > 1990 || viewType=="zoom1950v2") {
			tooltip_orientation = "right";
		}
	}
	function hideTooltip() {
		shown = false;
	}

	$: {
		viewType, tooltip_orientation, shown;
		if (position.x+position.y+position.speed != currentPos) {
			currentPos = position.x+position.y+position.speed
			hideTooltip();
		}
	}

</script>

<div class="movie {addClass} hover-{shown}" style="
left: {position.x};
top: {position.y};
width: {position.width};
height: {position.height};
background: {position.color};
transition: right {position.speed}ms cubic-bezier(0.420, 0.000, 0.580, 1.000), 
left {position.speed}ms cubic-bezier(0.420, 0.000, 0.580, 1.000),
top {position.speed}ms cubic-bezier(0.420, 0.000, 0.580, 1.000), 
bottom {position.speed}ms cubic-bezier(0.420, 0.000, 0.580, 1.000); 
background {position.speed}ms cubic-bezier(0.420, 0.000, 0.580, 1.000);
" on:mouseenter|preventDefault={toggleTooltip} on:mouseleave|preventDefault={hideTooltip}>
<div class='tooltip {tooltip_orientation} {shown}'>
	<div class="film_title">{data["title_year"]}</div>
	<div class="data_point">{data[sortedColumn + "_exp"]}</div>
</div>
</div>
<style>
	.movie {
		position: absolute;
		border: 1px solid #2C252F;
		box-sizing: border-box;
		transition-timing-function: cubic-bezier(0.550, 0.055, 0.675, 0.190); /* easeInCubic */
		font-size: 8px;
		text-align: center;
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
	}
	.movie.hl {
		background: black !important;
	}
	.tooltip {
		position: absolute;
		left: 0;
		bottom: 110%;
		background: rgba(0,0,0,0.85);
		color: white;
		padding: 9px;
		display: none;
		width: 200px;
		text-align: left;
		font-size: 13px;
		pointer-events: none;
	}
	.hover-true .tooltip {
		display: block;
	}
	.film_title {
		font-size: 13px;
		line-height: 15px;
		font-weight: bold;
	}
	.data_point {
		font-size: 12px;
		line-height: 14px;
		margin-top: 5px;
		color: #dedede;
	}
	.tooltip.right {
		left: auto;
		right: 0;
	}
	.movie.hover-true {
		z-index: 999999;
		border: 1px solid #fff;
	}
</style>
