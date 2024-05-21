<script>
	export let data, position, sortedColumn;

	const year = data["first_year"];
	let addClass = "";
	if (data["title_year"] == "Interstellar (2014)") {
		addClass = "hl";
	}
</script>

<div class="movie {addClass}" style="
	left: {position.x};
	top: {position.y};
	width: {position.width};
	height: {position.height};
	background: {position.color};
	transition: left {position.speed}ms cubic-bezier(0.420, 0.000, 0.580, 1.000), 
		        top {position.speed}ms cubic-bezier(0.420, 0.000, 0.580, 1.000), 
		        bottom {position.speed}ms cubic-bezier(0.420, 0.000, 0.580, 1.000), 
		        background {position.speed}ms cubic-bezier(0.420, 0.000, 0.580, 1.000);
	"
>
{data[sortedColumn]}
<div class='tooltip'>{data["title_year"]}</div>
</div>
<style>
	.movie {
		position: absolute;
		border: 1px solid #0F0A0F;
		box-sizing: border-box;
		background: black;
		transition-timing-function: cubic-bezier(0.420, 0.000, 0.580, 1.000); /* ease-in-out */
		font-size: 10px;
		text-align: center;
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
	}
	.movie.hl {
		border: 2px solid #fff;
	}
	.tooltip {
		position: absolute;
		left: 0;
		bottom: 105%;
		background: black;
		color: white;
		padding: 4px;
		display: none;
		width: 100px;
		text-align: left;
		font-size: 13px;
		pointer-events: none;
	}
	.movie:hover {
		z-index: 99;
		border: 1px solid #fff;
	}
	.movie:hover .tooltip {
		display: block;
	}
</style>
