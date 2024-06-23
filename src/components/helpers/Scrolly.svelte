<script>
	/**
	 * This component manages which item is intersecting with the top of the window for scroll triggering
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
	import { onMount, onDestroy } from "svelte";

	export let root = null;
	export let top = 0;
	export let bottom = 0;
	export let increments = 100;
	export let value = undefined;
	export let progress = 0; // New progress variable

	const steps = [];
	const threshold = [];

	let nodes = [];
	let intersectionObservers = [];
	let container;
	let topIntersectingNode;

	$: top, bottom, update();

	const update = () => {
		if (!nodes.length) return;
		nodes.forEach(createObserver);
	};

	const topIntersecting = () => {
		for (let i = 0; i < steps.length; i++) {
			if (steps[i] > 0) {
				value = i;
				topIntersectingNode = nodes[i];
				handleScroll(); // Update progress for the top intersecting container
				return;
			}
		}
		value = undefined;
		topIntersectingNode = null;
		progress = 0;
	};

	const createObserver = (node, index) => {
		const handleIntersect = (e) => {
			const intersecting = e[0].isIntersecting;
			steps[index] = intersecting ? e[0].intersectionRatio : 0;
			topIntersecting();
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

	const handleScroll = () => {
		if (!topIntersectingNode) return;

		const containerRect = topIntersectingNode.getBoundingClientRect();
		const windowHeight = window.innerHeight;

		if (containerRect.top > windowHeight || containerRect.bottom < 0) {
			progress = 0;
			return;
		}

		const scrollTop = window.scrollY || window.pageYOffset;
		const containerTop = scrollTop + containerRect.top;
		const containerHeight = topIntersectingNode.scrollHeight;

		const scrollPosition = scrollTop - containerTop;
		progress = Math.min(Math.max((scrollPosition / containerHeight) * 100, 0), 100);
	};

	onMount(() => {
		for (let i = 0; i < increments + 1; i++) {
			threshold.push(i / increments);
		}
		nodes = container.querySelectorAll(":scope > *:not(iframe)");
		update();

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', handleScroll);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
		intersectionObservers.forEach(io => io.disconnect());
	});
</script>

<div id="scrolly_container" bind:this={container}>
	<slot />
</div>
