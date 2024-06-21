<script>
	import Movie from '$components/scifi/Scifi.movie.svelte';
	import Scene from "$components/scifi/Scifi.scene.svelte";
	import { slide } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let decade, movies, positions, sortedColumn, value, barHeight, bottomPadding, viewType, decadesShown, sceneNum, progress, sceneRatio, prefersReducedMotion, hl_movie_index;
	let opacity = 0;
	let duration = 1000; // Duration of the transition in milliseconds

	const datapoint = tweened(0, {
		duration,
		easing: cubicOut
	});

	function calculateValues() {
		let total = 0;
		for (let i = 0; i < movies.length; i++) {
			if (movies[i][sortedColumn] > 0 || movies[i][sortedColumn] == "future") {
				total += 1;
			}
		}
		return Math.round(total/movies.length*100);
	}

	$: {
		value;
		if (decadesShown.indexOf(String(decade)) != -1 && viewType != "zoom1950" && viewType != "zoom2020" && viewType != "zoom2030") {
			opacity = 1;
		} else {
			opacity = 0;
		}
		datapoint.set(calculateValues());
		hl_movie_index;
	}

	// Derived store to ensure no decimals
	let roundedDatapoint;
	$: roundedDatapoint = Math.round($datapoint);
</script>

<div class="decade-container">
	<h2 style="opacity: {opacity*.5};">{decade}</h2>
	{#if sortedColumn != "top200"}
		<h3 style="opacity: {opacity}; bottom: {barHeight + 60}px;" transition:slide>{roundedDatapoint}%</h3>
	{/if}
	<div class="movie-container" style="opacity: {opacity};">
		{#each movies as movie}
		<Movie data={movie} position={positions[movie.index]} {viewType} sortedColumn={sortedColumn} {decade} {hl_movie_index}/>
		{/each}
	</div>
</div>

<style>
	.decade-container {
		position: relative; /* Set the container to be relative */
		margin-bottom: 20px;
		display: inline-block;
		width: 12.5%;
		height: 100%;
		box-sizing: border-box;
		transform: perspective(0) translate3d(0, 0, 0) scale(1);
		z-index: 1;
	}
	.decade-container:hover {
		z-index: 10;
	}
	.movie-container {
		width: 100%;
		height: 100%;
		transition: opacity 500ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
	}
	.decade-container h2 {
		position: absolute;
		left: 0;
		bottom: 40px;
		width: 100%;
		text-align: center;
		font-size: 1.5em;
		color: white;
		opacity: 0.5;
		font-family: CozetteVector, Courier, monospace;
	}
	@media screen and (max-width: 640px) {
		.decade-container h2 {
			font-size: 1.3em;
		}
	}
	@media screen and (max-width: 440px) {
		.decade-container h2 {
			font-size: 1.1em;
		}
	}

	.decade-container h3 {
		position: absolute;
		left: 0;
		width: 100%;
		text-align: center;
		font-size: 1.3em;
		color: #fb04d3;
		font-family: CozetteVector, Courier, monospace;
	}
	@media screen and (max-width: 640px) {
		.decade-container h3 {
			font-size: 1.2em;
		}
	}
	@media screen and (max-width: 440px) {
		.decade-container h3 {
			font-size: 1.1em;
		}
	}
</style>
