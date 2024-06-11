<script>
	import Movie from '$components/scifi/Scifi.movie.svelte';
	import Scene from "$components/scifi/Scifi.scene.svelte";
	export let decade, movies, positions, sortedColumn, value, barHeight, bottomPadding, viewType, decadesShown, sceneNum, sceneMaxLookup, progress, sceneRatio;
	let opacity = 0;

	$: {
    	// decadesShown;

		if (decadesShown.indexOf(String(decade)) != -1) {
			opacity = 1;
		} else {
			opacity = 0;
		}
    	// console.log(decadesShown, opacity, decadesShown.indexOf(String(decade)))
	}
</script>

<div class="decade-container" style="opacity: {opacity};">
	<h2>{decade}</h2>
	<div class="movie-container">
		{#each movies as movie}
		<Movie data={movie} position={positions[movie.index]} sortedColumn={sortedColumn} />
		{/each}
	</div>
	{#if ["1950"].indexOf(decade) != -1}
		<Scene {decade} {value} {barHeight} {bottomPadding} {viewType} sceneMax={sceneMaxLookup[decade]} {sceneNum} {progress} {sceneRatio} nextDecade=""/>
	{/if}
	{#if decade == "2020"}
		<Scene {decade} {value} {barHeight} {bottomPadding} {viewType} sceneMax={sceneMaxLookup[decade]} {sceneNum} {progress} {sceneRatio} nextDecade="nextDecade"/>
		<Scene decade="2030" {value} {barHeight} {bottomPadding} {viewType} sceneMax={sceneMaxLookup["2030"]} {sceneNum} {progress} {sceneRatio} nextDecade="nextDecade" />
	{/if}
</div>

<style>
	.decade-container {
		position: relative; /* Set the container to be relative */
		margin-bottom: 20px;
		display: inline-block;
		width: 12.5%;
		height: 100%;
		box-sizing: border-box;
		transition: opacity 2000ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transform: perspective(0) translate3d(0, 0, 0) scale(1);
	}
	.movie-container {
		width: 100%;
		height: 100%;
	}
	.decade-container h2 {
		position: absolute;
		left: 0;
		bottom: 60px;
		width: 100%;
		text-align: center;
		font-size: var(--15px);
		color: white;
	}
</style>
