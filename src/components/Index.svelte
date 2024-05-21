<script>
	import { getContext } from "svelte";
	import Scifi from "$components/scifi/Scifi.svelte";
	// import WIP from "$components/helpers/WIP.svelte";
	// import Footer from "$components/Footer.svelte";

	const copy = getContext("copy");
	// const data = getContext("data");
</script>


<Scifi copy={copy} />
<!-- <Footer /> -->
