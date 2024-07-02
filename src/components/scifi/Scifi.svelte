<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide, fly } from 'svelte/transition';
  import Scrolly from "$components/helpers/Scrolly.svelte";
  import Decade from "$components/scifi/Scifi.decade.svelte";
  import Scene from "$components/scifi/Scifi.scene.svelte";
  import Text from "$components/scifi/Scifi.text.svelte";
  import Toggle from "$components/helpers/Toggle.svelte";
  export let copy;
  import movies from "$data/movies.json";
  import { groupByDecade, sortByAttributes, getContrastingColors, options } from '$components/helpers/helpers.js';
  const decades = groupByDecade(movies);

  let h = 1;
  let w = 1;
  let catLen;
  let value;
  let titleOn = "title";
  let chartTitleLoc_y = 50;
  let prefersReducedMotion = false;
  let noAnimation = false;
  let instantAnimation = true;

  let zoomSpeed = 3400;
  let loadGraphic = false;
  let hl_movie_index = null;
  let stepCount = copy.timeline.length; 

  const colorLookupEra = {
    "future": "#fb04d3",
    "present": "#9d1fa1",
    "past": "#6d1170",
    "multiple/other": "#5d3769"
  };
  const colorLookup = {
    "yes": "#ff1cce",
    "somewhat": "#bd1398",
    "no": "#5d3769"
  };
  const colorLookupNumber = {
    1: "#ff1cce",
    0.5: "#bd1398",
    0: "#5d3769"
  };
  let colors = ["#fb04d3","#9d1fa1","#6d1170","#5d3769"];
  let loaded = false;
  let decadesShown;
  let objectSize = { width: 24, height: 14 };
  let viewType = "zoom1950";
  let sceneNum = 0;
  let prev_viewType;
  let prev_sceneNum;
  let progress = 0;
  let sceneRatio = 0.4;

  let sceneMax = 4.3;
  let translate = {x: w, y: 0, z: 8};

  let sortedColumn = "Social Issues";
  let positions = {};
  let bottomPadding = 90;
  let barHeight = 50;

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function calculatePositions() {
    // Sort the movies by the specified attributes and group by decade
    const objects = sortByAttributes([...movies], sortedColumn, "decade");
    const uniqueDecades = [...new Set(objects.map(obj => obj.decade))];
    const decadeCount = uniqueDecades.length;

    // Calculate effective container dimensions
    const effectiveContainerWidth = w;
    const effectiveContainerHeight = h;
    // Calculate the number of elements per row based on screen aspect ratio
    const aspectRatio = w / h;  // Using width-to-height ratio to ensure correct behavior
    // sceneMax = 4 + (h/(w*0.8));
    // Calculate object sizes to ensure 200 elements per decade fit
    const elementsPerDecade = 200;
    const spacePerDecade = effectiveContainerWidth / decadeCount;
    const objectWidth = Math.sqrt(spacePerDecade * effectiveContainerHeight / elementsPerDecade) / 1.8;
    objectSize.width = objectWidth;
    objectSize.height = objectWidth * 1.4;

    if (viewType == "zoom1950v2" && aspectRatio < 1.2) {
      objectSize.width = objectWidth * (2.4-aspectRatio);
      objectSize.height = objectWidth * (3.4-aspectRatio);
    }

    // Assign unique colors to each unique value of the sorted column
    const uniqueValues = [...new Set(objects.map(obj => obj[sortedColumn]))];

    // Group objects by decade
    const groupedByDecade = objects.reduce((group, obj) => {
      group[obj.decade] = group[obj.decade] || [];
      group[obj.decade].push(obj);
      return group;
    }, {});

    const positions = {};

    // const elementsPerRow = Math.max(1, Math.floor(4 * aspectRatio)) + 2; // Adjust the multiplier as needed
    let elementsPerRow = 10;

    if (aspectRatio < 0.9 && viewType == "all") {
      elementsPerRow = 5;
    } else if (aspectRatio < 1.4) {
      elementsPerRow = 8;
    }

    if (viewType == "zoom1950v2") {
      elementsPerRow = 10;
      if (aspectRatio > 2.1) {
        elementsPerRow = 20;
      }
    }

    const elementsPerCol = 200 / elementsPerRow;
    barHeight = (elementsPerCol * objectSize.height);
    if (elementsPerRow == 5) {
      barHeight = barHeight*.95
    }

    const leftPadding = (spacePerDecade - (elementsPerRow*(objectSize.width - 1.5) )) / 2;
    const sceneWidth = barHeight * sceneRatio * 8
    let multiplier = w / sceneWidth;
    
    titleOn = "";
    if (viewType == "zoom1950" && sceneNum < 2) {
      titleOn = "title";
    }
    if (viewType == "zoom2030" && sceneNum > 2) {
      titleOn = "end";
    }
    // reset translate
    translate = {x: 0, y: 0, z: 1}; 
    if (viewType != "all") {
      translate.y = -(barHeight*translate.z) + barHeight;
      // if (aspectRatio < 0.9) {
      //  translate.y = -(barHeight/2) + barHeight * 1.5 * aspectRatio;
      // }
      translate.x = w / 2 - spacePerDecade/2;
    }
    chartTitleLoc_y = barHeight / h * 100 + 26*translate.z;
    if (chartTitleLoc_y > 85) {
      chartTitleLoc_y = 85;
    }
    // Iterate through each decade to calculate positions
    uniqueDecades.forEach((decade, decadeIndex) => {
      const decadeObjects = sortByAttributes(groupedByDecade[decade], sortedColumn, "decade");
      let xPos = 0;
      let yPos = effectiveContainerHeight - objectSize.height - bottomPadding;

      decadeObjects.forEach((obj, index) => {
        // If the index is a multiple of elementsPerRow, move to next row
        if (index % elementsPerRow === 0 && index > 0) {
          xPos = 0;
          yPos -= objectSize.height - 1;
        }

        const objIndex = obj.index;

        // Calculate the actual positions within the relative container
        const containerWidth = (w * 0.125) - 20; // 12.5% of the width minus some padding
        let xRelativePos = (xPos / spacePerDecade) * 100 + (spacePerDecade - objectSize.width*elementsPerRow)/spacePerDecade*50;
        let yRelativePos = (yPos / effectiveContainerHeight) * 100;
        let nudgePixels = effectiveContainerHeight * 0.004;
        if (obj[sortedColumn] > 0 || obj[sortedColumn] == "future") {
          if (w > 600) {
            yRelativePos = yRelativePos -(nudgePixels / effectiveContainerHeight) * 100;
            xRelativePos = xRelativePos + (nudgePixels / spacePerDecade) * 100;              
          } else {
            yRelativePos = yRelativePos -(nudgePixels / effectiveContainerHeight) * 100;
            xRelativePos = xRelativePos + (nudgePixels / spacePerDecade) * 30;
          }
        }
        let movie_colors = colorLookupNumber;
        colors = colorLookup;
        if (sortedColumn.indexOf("Era") != -1) {
          movie_colors = colorLookupEra;
          colors = colorLookupEra;
        }
        let speed = 0;
        if (!prefersReducedMotion || !noAnimation) {
          speed = Math.random() * 1200 + 100;
        }
        positions[objIndex] = {
          x: `${xRelativePos}%`,
          y: `${yRelativePos}%`,
          width: `${objectSize.width + 1}px`,
          height: `${objectSize.height}px`,
          speed: speed,
          color: movie_colors[obj[sortedColumn]] // Assign color based on sortedColumn value
        };

        // Move to the next position in the row
        xPos += objectSize.width;
      });
    });
    
    return positions;
  }

  function dispatchResize() {
    instantAnimation = true;
    positions = calculatePositions();
  }

  function handleScroll() {
    positions = calculatePositions();
  }

  const debouncedHandleScroll = debounce(handleScroll, 100);

  $: {
    w, h, progress, titleOn, barHeight;
    value = value === undefined ? 0 : value;
    decadesShown = copy.timeline[value].decades === undefined ? "(1950,1960,1970,1980,1990,2000,2010,2020)" : copy.timeline[value].decades;
    sortedColumn = copy.timeline[value]["variable"];
    hl_movie_index = copy.timeline[value]["movie_hl"];
    viewType = copy.timeline[value]["view"] === undefined ? "all" : copy.timeline[value]["view"];
    sceneNum = copy.timeline[value]["sceneNum"] === undefined ? -1 : Number(copy.timeline[value]["sceneNum"]);

    if (prev_viewType != viewType || prev_sceneNum != sceneNum || !loaded || (viewType != "zoom1950" && viewType != "zoom2020" && viewType != "zoom2030") ) {
      positions = calculatePositions();
      prev_viewType = viewType;
      prev_sceneNum = sceneNum;  
      loaded = true;
      positions = calculatePositions();
    } 
    if (progress != 0) {
      instantAnimation = false;
    }
    if (copy.timeline[value].zoomSpeed) {
      zoomSpeed = copy.timeline[value].zoomSpeed;
    } else {
      zoomSpeed = 3400;
    }
    if (h > 1 && w > 1) {
      loadGraphic = "loadGraphic";
    }
    // if (copy.timeline[value]["sceneNum"] === undefined) {
    //  // progress = 0;
    // }
  }

  onMount(() => {
    positions = calculatePositions();
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function updatePreference(e) {
      prefersReducedMotion = e.matches;
    }

    // Add listener
    mediaQuery.addListener(updatePreference);

    // Set initial value
    prefersReducedMotion = mediaQuery.matches;
    // Cleanup function
    if (w < 500) {
      prefersReducedMotion = true;
      noAnimation = true;
    }
    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  });

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', debouncedHandleScroll);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', debouncedHandleScroll);
    }
  });
</script>
<svelte:window on:resize={dispatchResize}></svelte:window>
<!-- <div class="debug">
	{value}<br>
	{sceneNum}<br>
	{progress}
</div> -->
<div class="outsideContainer">
	<section id="scrolly">

		<div class="visualContainer {loadGraphic} {titleOn} reduceMotion-{prefersReducedMotion} reduceMotion-{noAnimation} reduceMotion-{instantAnimation}" bind:clientWidth={w} bind:clientHeight={h}>
			{#if viewType == "all" || viewType.indexOf("v2") != -1}
			<div class="chartTitles" style="bottom: {chartTitleLoc_y}%;">
				<div class="legend_title">{copy.timeline[value].hed}</div>
				<div class="legend_container">
					{#each copy.timeline[value].categories as category, i}
					<div class="legendItem" style="background: {colors[category.toLowerCase()]};">{category}</div>
					{/each}
				</div>
			</div>
			{/if}
			<div class="zoomContainer {viewType}" style="
			transform: perspective(0) translate3d({translate.x}px,{translate.y}px, 0) scale({translate.z});
			transition: transform {0}ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
			">
			{#each Object.keys(decades) as decade}
			<Decade {h} {noAnimation} decade={decade} movies={decades[decade]} positions={positions} sortedColumn={sortedColumn} {value} {barHeight} {bottomPadding} {viewType} {decadesShown} {sceneNum} {progress} {sceneRatio} {prefersReducedMotion} {hl_movie_index}/>
			{/each}
			<Decade {h} {noAnimation} decade={2030} movies={[]} positions={positions} sortedColumn={sortedColumn} {value} {barHeight} {bottomPadding} {viewType} {decadesShown} {sceneNum} {progress} {sceneRatio} {prefersReducedMotion} {hl_movie_index}/>
		</div>
		<div class="scene_wrapper">
			<Scene decade={1950} {w} {h} {value} {barHeight} {bottomPadding} {viewType} {sceneMax} {sceneNum} {progress} {sceneRatio} {prefersReducedMotion} {stepCount} nextDecade=""/>
			<Scene decade={2020} {w} {h} {value} {barHeight} {bottomPadding} {viewType} {sceneMax} {sceneNum} {progress} {sceneRatio} {prefersReducedMotion} {stepCount} nextDecade=""/>
			<Scene decade={2030} {w} {h} {value} {barHeight} {bottomPadding} {viewType} {sceneMax} {sceneNum} {progress} {sceneRatio} {prefersReducedMotion} {stepCount} nextDecade=""/>
		</div>

		{#if sceneNum == -1 && viewType == "zoom1950"}
		<div class="title_container" transition:fade>
			<h1>{copy.Hed}</h1>
			<div class="byline">by <a href="https://pudding.cool/author/alvin-chang/">Alvin Chang</a></div>
			{#if w > 500}
			<Toggle label="Animation" bind:value={noAnimation} options={ [{value: false, text: "On"}, {value: true, text: "Off"}] }/>
			{/if}
		</div>
		<div class="videoTeaser" transition:fade>
			Don't feel like scrolling? <a href="https://www.youtube.com/@thepudding">Watch the video instead!</a>
		</div>
		{/if}

	</div>


	<Scrolly bind:value top={0} bind:progress={progress}>
		{#each copy.timeline as step_obj, i}
		{@const active = value === i}
		{@const is_firstyear = copy.timeline.findIndex(item => item.time === step_obj.time) === i}

		<div class="step {step_obj.addclass ? step_obj.addclass : 'short_stage'} steptype_{step_obj.type}" class:active>
			{#if step_obj.text != ""}	
			<Text copy={step_obj.text}  type={step_obj.type} time={step_obj.time} add={step_obj.addclass === "longcopy" ? "longcopy" : "shortcopy"} />
			{/if}
		</div>
		{/each}
	</Scrolly>

</section>
</div>
<div class="methods">
	<div class="methods_container">
		<h2>Methodology</h2>
		<div>
			{copy.Methodology}
		</div>
	</div>
</div>

<style>
	.debug {
		position: fixed;
		left: 0px;
		top: 0px;
		background: black;
		color: white;
		z-index: 99999999;
	}
	.visualContainer {
		overflow: hidden;
		position: sticky;
		top: 0px;
		left: 0px;
		display: block;
		width: 100%;
		padding: 0 0px;
		height: 100vh;
		transition: opacity 200ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		opacity: 0;
	}
	.visualContainer.reduceMotion-true, .visualContainer.reduceMotion-true * {
		transition: none !important;
	}
	.visualContainer.title {
		background: #e9abff;
		font-family: CozetteVector, Courier, monospace;
	}
	.visualContainer.end {
		background: #a35c9e;
	}
	.title_container {
		position: absolute;
		left: 0%;
		width: 100%;
		text-align: center;
		bottom: 65vh;
		color: #200724;
		font-weight: bold;
		font-family: CozetteVector, Courier, monospace;
		z-index: 99999;
	}
	@media screen and (max-width: 600px) {
		.title_container {
			bottom: 60vh;
		}
	}
	@media screen and (max-width: 500px) {
		.title_container {
			bottom: 77vh;
		}
	}
	.title_container.title_container h1 {
		font-size: 2em;
	}
	.title_container .byline {
		font-size: 1.2em;
		opacity: 0.6;
	}
	.chartTitles {
		color: white;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		padding: 0 10px;
		text-align: center;
		bottom: var(--chartTitleLocY, 0); /* Using CSS variable for dynamic positioning */
	}
	.legend_container {
		color: white;
		display: flex;
		flex-direction: row;
		align-items: center; 
		justify-content: center; /* Centers items horizontally */
		text-align: center;
	}
	.legend_title {
		margin-bottom: 5px;
		font-size: 1.5em;
		padding-bottom: 0px;
		line-height: 1em;
		font-family: CozetteVector, Courier, monospace;
	}
	.legendItem {
		flex: 0 0 auto;
		align-items: center;
		text-align: center;
		justify-content: center;
		color: var(--color-lightpurple);
		white-space: normal;
		margin: 2px;
		padding: 0 4px;
		min-width: 40px;
		text-shadow: 0px 0px 4px #000;
		font-size: 1.2em;
		font-family: CozetteVector, Courier, monospace;
	}
	.zoomContainer {
		width: 100%;
		height: 100vh;
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transform: perspective(0) translate3d(0, 0, 0) scale(1);
		transform-origin: top left;
	}
	.scene_wrapper {
		pointer-events: none;
		position: absolute;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100vh;
	}
	.visualContainer.loadGraphic {
		opacity: 1;
	}
	.reduceMotion-true .zoomContainer {
		transition: none !important;
	}

	.methods {
		background: #a35c9e;
		margin-top: -30px;
		padding: 10px 0 100px;
	}
	.methods .methods_container {
		max-width: 620px;
		margin: 0 auto;
		padding: 0 10px;
		box-sizing: border-box;
	}
	.methods .methods_container h2 {
		font-family: CozetteVector, Courier, monospace;
		font-size: var(--20px);
		color: #f2d3ec;
	}
	.methods .methods_container div {
		font-size: var(--14px);
		line-height: var(--22px);
		color: #4d1c44;
		font-family: var(--sans);
		color: #f2d3ec;
	}
	.videoTeaser {
		position: fixed;
		color: white;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		background: #000;
		padding: 20px;
		max-width: 500px;
		width: 90%;
		z-index: 100000;
	}
	.videoTeaser a {
		color: #fb04d3;
	}
	.videoTeaser a:hover {
		opacity: 0.9;
	}
</style>