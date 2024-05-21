<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Movie from "$components/scifi/Scifi.movie.svelte";
	export let copy;
	import movies from "$data/movies.json";

	let h = 700;
	let w = 800;
    let objectSize = { width: 24, height: 14 }; // Adjust the size as needed
    const options = [
    	"Category", "Social Issues", "Era", "Present/Near Future", "Sci Exploration", 
    	"Dystopian/Post-Apoc", "Utopian/Idealistic", "Triumph of Humanity", "Failure of Humanity", 
    	"World Before", "World During", "World After", "Less Suffering", "More Abundance", 
    	"More Egalitarianism", "More Human Agency", "More Sense of Wonder", "Tech Improves Existence", 
    	"Comments on Climate", "Comments on Mental Health", "Critique Women's Rights", 
    	"Critique Politics", "Critique Religion", "Critique War", "Critique Science/Tech", 
    	"Tech Solves Problem", "Existential Threat", "World_v_Reality", "Type of Conflict"
    	];

    let sortedColumn = "Social Issues";
    let positions = {};

    $: positions = calculatePositions();

    function sortByAttributes(array, primaryAttribute, secondaryAttribute) {
    	return array.sort((a, b) => {
    		const aPrimary = String(a[primaryAttribute]);
    		const bPrimary = String(b[primaryAttribute]);
    		const aSecondary = String(a[secondaryAttribute]);
    		const bSecondary = String(b[secondaryAttribute]);

    		const aIsNA = aPrimary.startsWith('N/A');
    		const bIsNA = bPrimary.startsWith('N/A');

    		if (aIsNA && !bIsNA) {
            return -1; // a should come before b
        }
        if (!aIsNA && bIsNA) {
            return 1; // b should come before a
        }
        if (aPrimary < bPrimary) {
        	return -1;
        }
        if (aPrimary > bPrimary) {
        	return 1;
        }
        if (aSecondary < bSecondary) {
        	return -1;
        }
        if (aSecondary > bSecondary) {
        	return 1;
        }
        return 0;
    });
    }

    
    function getContrastingColors(uniqueValues) {
    	const og_colors = ['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a'];
    	const step = Math.floor(og_colors.length / uniqueValues);
    	const contrastingColors = [];
    	for (let i = 0; i < uniqueValues; i++) {
    		contrastingColors.push(og_colors[i * step]);
    	}
    	return contrastingColors;
    }


    function calculatePositions() {
    	objectSize.width = w * h / 60000;
    	objectSize.height = w * h / 100000;
    	let objects = sortByAttributes([...movies], sortedColumn, "decade");

    	const width = objectSize.width;
    	const height = objectSize.height;
    	const currentPositions = {};
    	

        // Find unique decades
    	const uniqueDecades = [...new Set(objects.map(obj => obj.decade))];
    	const decadeCount = uniqueDecades.length;

        const effectiveContainerWidth = w - 60; // Subtracting 30px from both sides
        const effectiveContainerHeight = h - 60; // Subtracting 30px from top and bottom
        const spacePerDecade = effectiveContainerWidth / decadeCount;

        // Create a map to assign a unique color for each unique value of sortedColumn
        const uniqueValues = [...new Set(objects.map(obj => obj[sortedColumn]))];
        const colors = getContrastingColors(uniqueValues.length);
        const valueColorMap = {};
        uniqueValues.forEach((value, index) => {
        	valueColorMap[value] = colors[index % colors.length];
        });

        // Group objects by decade
        const groupedByDecade = {};
        objects.forEach(obj => {
        	if (!groupedByDecade[obj.decade]) {
        		groupedByDecade[obj.decade] = [];
        	}
        	groupedByDecade[obj.decade].push(obj);
        });

        // Iterate through each decade to calculate positions
        uniqueDecades.forEach((decade, decadeIndex) => {
        	const decadeObjects = sortByAttributes(groupedByDecade[decade], sortedColumn, "decade");
        	let initialXPos = 30 + decadeIndex * spacePerDecade;
        	let xPos = initialXPos;
        	let yPos = effectiveContainerHeight - height;

        	decadeObjects.forEach((obj, i) => {
                // If xPos exceeds the allocated space for the decade, move to next row
        		if (xPos + width > initialXPos + spacePerDecade) {
        			xPos = initialXPos;
        			yPos -= height;
        		}

        		let index = obj.index;

        		currentPositions[index] = { x: xPos, y: yPos };
        		positions[index] = { 
        			x: `${xPos}px`, 
        			y: `${yPos}px`, 
        			width: `${width}px`, 
        			height: `${height}px`, 
        			speed: Math.random()*1000 + 200,
                    color: valueColorMap[obj[sortedColumn]] // Assign color based on sortedColumn value
                };

                // Move to the next position in the row
                xPos += width;
            });
        });

        return positions;
    }

    function dispatchResize() {
    	positions = calculatePositions();
    }

    function sortedChanged() {
    	positions = calculatePositions();
    }

    $: {
    	positions = calculatePositions();
    	w = w;
    }
</script>

<svelte:window on:resize={dispatchResize} />


<div class="chartContainer" bind:clientWidth={w} bind:clientHeight={h}>
	<select bind:value={sortedColumn} on:change={sortedChanged} id="sortedColumn">
		{#each options as option}
		<option value={option}>{option}</option>
		{/each}
	</select>

	{#each movies as movie}
	<Movie data={movie} position={positions[movie["index"]]} sortedColumn={sortedColumn}/>
	{/each}
</div>

<style>
	#sortedColumn {
		position: absolute;
		left: 10px;
		top: 10px;
	}
	.chartContainer {
		display: block;
		position: relative;
		width: 100%;
		padding: 0 20px;
		height: 100vh;
	}
</style>
