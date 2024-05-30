<script>
	/**
	 * This component manages which item is most in view for scroll triggering
	 * example:
	 * <Scrolly
	 * 	bind:value={scrollIndex}
	 * >
	 * **items here**
	 * </Scrolly>
	 *
	 * optional params with defaults
	 * <Scrolly root={null} top={0} bottom={0} increments={100}>
	 */
	import { onMount } from "svelte";
	export let root = null;
	export let top = 0;
	export let bottom = 0;
	export let increments = 100;
	export let value = undefined;

	const steps = [];
	const threshold = [];

	let nodes = [];
	let intersectionObservers = [];
	let container;
	export let progress;

	$: top, bottom, update();

	const update = () => {
		if (!nodes.length) return;
		nodes.forEach(createObserver);
	};

	const mostInView = () => {
  let maxRatio = 0;
  let maxIndex = -1; // initialize to -1 to handle the case when no step is intersecting

  // Get the viewport height
  const viewportHeight = window.innerHeight;

  for (let i = 0; i < steps.length; i++) {
    if (steps[i] > 0) {
      // Check if the current step is intersecting with the top of the screen
      const currentStepElement = nodes[i];
      const currentStepTop = currentStepElement.offsetTop;
      const currentStepHeight = currentStepElement.offsetHeight;
      const topOfScreenPosition = window.pageYOffset;

      if (currentStepTop <= topOfScreenPosition && currentStepTop + currentStepHeight >= topOfScreenPosition) {
        maxRatio = steps[i];
        maxIndex = i;
      }
    }
  }

  if (maxIndex >= 0) {
    value = maxIndex;

    // Get the current step element
    const currentStepElement = nodes[maxIndex];

    // Calculate the scroll progress based on the current step and top of the screen
    const currentStepTop = currentStepElement.offsetTop;
    const currentStepHeight = currentStepElement.offsetHeight;
    const scrollPosition = window.pageYOffset;
    const scrollProgressInStep = Math.max(
      0,
      Math.min(
        1,
        (scrollPosition - currentStepTop) / currentStepHeight
      )
    );

   	progress = scrollProgressInStep;
  } else {
    value = undefined;
  }
};

	const createObserver = (node, index) => {
		const handleIntersect = (e) => {
			const intersecting = e[0].isIntersecting;
			const ratio = e[0].intersectionRatio;
			steps[index] = ratio;
			mostInView();
		};

		const marginTop = top ? top * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin, threshold };

		if (intersectionObservers[index]) intersectionObservers[index].disconnect();

		const io = new IntersectionObserver(handleIntersect, options);
		io.observe(node);
		intersectionObservers[index] = io;
	};

	onMount(() => {
		for (let i = 0; i < increments + 1; i++) {
			threshold.push(i / increments);
		}
		nodes = container.querySelectorAll(":scope > *:not(iframe)");
		update();
	});
</script>

<div bind:this={container}>
	<slot />
</div>
